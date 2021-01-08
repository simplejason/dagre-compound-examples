/**
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/NG-ZORRO/ng-zorro-antd/blob/master/LICENSE
 */

import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  Input,
  OnChanges,
  Renderer2,
  SimpleChanges
} from '@angular/core';
import {HierarchyBaseNodeInfo, HierarchyGraphNodeInfo} from "dagre-compound";

interface Info {
  x: number;
  y: number;
  width: number;
  height: number;
}
@Component({
  selector: '[graph-node]',
  template: `
    <svg:g>
      <svg:rect [attr.width]="node.width" [attr.height]="node.height" class="node-rect" />
      <svg:text>
        <tspan dy="1em" x="1">
          {{node.name}}
        </tspan>
      </svg:text>
    </svg:g>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class GraphNodeComponent implements OnChanges {
  @Input() node!: HierarchyBaseNodeInfo | HierarchyGraphNodeInfo;
  constructor(private el: ElementRef, private renderer2: Renderer2) {}

  ngOnChanges(_changes: SimpleChanges) {
    this.render();
  }

  render(): void {
    const cur = this.getAnimationInfo();
    // Need this for canvas for now.
    this.renderer2.setAttribute(this.el.nativeElement, 'transform', `translate(${cur.x}, ${cur.y})`);
  }

  getAnimationInfo(): Info {
    const { x, y } = this.nodeTransform();
    return {
      width: this.node.width,
      height: this.node.height,
      x,
      y
    };
  }

  nodeTransform(): { x: number; y: number } {
    const x = this.computeCXPositionOfNodeShape() - this.node.width / 2;
    const y = this.node.y - this.node.height / 2;
    return { x, y };
  }

  computeCXPositionOfNodeShape(): number {
    if ((this.node as HierarchyGraphNodeInfo).expanded) {
      return this.node.x;
    }
    return this.node.x - this.node.width / 2 + this.node.coreBox.width / 2;
  }
}
