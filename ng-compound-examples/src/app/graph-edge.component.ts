import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  Input,
  NgZone,
  OnChanges,
  OnInit,
  SimpleChanges
} from '@angular/core';
import {curveBasis, line} from 'd3-shape';
import {take} from 'rxjs/operators';
import {HierarchyBaseEdgeInfo} from "dagre-compound";

@Component({
  selector: '[graph-edge]',
  template: `
    <svg:g>
      <path class="edge-line" [attr.marker-end]="'url(#arrow)'"></path>
    </svg:g>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class GraphEdgeComponent implements OnInit, OnChanges {
  @Input() edge!: HierarchyBaseEdgeInfo;

  public get id(): string {
    return `${this.edge.v}--${this.edge.w}`;
  }
  private el!: SVGGElement;
  private path!: SVGPathElement;

  private readonly line = line<{ x: number; y: number }>()
    .x(d => d.x)
    .y(d => d.y)
    .curve(curveBasis);

  constructor(private elementRef: ElementRef<SVGGElement>, private ngZone: NgZone, private cdr: ChangeDetectorRef) {
    this.el = this.elementRef.nativeElement;
  }

  ngOnInit(): void {
    this.path = this.el.querySelector('path')!;
  }

  ngOnChanges(changes: SimpleChanges): void {
    const { edge } = changes;
    if (edge) {
      this.ngZone.onStable.pipe(take(1)).subscribe(() => {
        this.setPath();
        this.cdr.markForCheck();
      });
    }
  }

  setPath(): void {
    this.path.setAttribute('d', this.line(this.edge.points)!);
  }
}
