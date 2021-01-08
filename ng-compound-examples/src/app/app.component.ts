import {Component} from '@angular/core';
import {buildGraph, HierarchyGraphNodeInfo, RankDirection} from "dagre-compound";

@Component({
  selector: 'ng-compound-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.less']
})
export class AppComponent {
  data = {
    nodes: [
      { id: "0-1" },
      { id: "0-2" },
      { id: "0-3" },
      { id: "0-4" },
      { id: "1-1" },
      { id: "1-2" }
    ],
    edges: [
      { v: "0-1", w: "0-2" },
      { v: "0-2", w: "0-3" },
      { v: "0-2", w: "0-4" },
      { v: "0-4", w: "1-1" },
      { v: "1-1", w: "1-2" }
    ],
    compound: {
      GROUP0: ["0-1", "0-2", "GROUP1"],
      GROUP1: ["0-3", "0-4"]
    }
  };
  rankDirection: RankDirection = 'LR';
  renderInfo = buildGraph(this.data, {
    rankDirection: this.rankDirection,
    expanded: ['GROUP0', 'GROUP1']
  });

  subGraphTransform = (node: HierarchyGraphNodeInfo) => {
    const x = node.x - node.width / 2.0 + node.paddingLeft;
    const y = node.y - node.height / 2.0 + node.paddingTop;
    return `translate(${x}, ${y})`;
  };

  coreTransform = (node: HierarchyGraphNodeInfo) => {
    return `translate(0, ${node.labelHeight})`;
  };

  expand = (): void => {
    this.renderInfo = buildGraph(this.data, {
      expanded: ['GROUP0', 'GROUP1']
    });
  }

  collapse = (): void => {
    this.renderInfo = buildGraph(this.data, {
      expanded: []
    });
  }
}
