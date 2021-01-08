import * as React from 'react';
import './App.css';
import {
  buildGraph,
  HierarchyGraphNodeInfo,
  HierarchyGraphDef,
  HierarchyBaseEdgeInfo,
  HierarchyBaseNodeInfo
} from 'dagre-compound';
import * as d3 from 'd3';

interface SvgContainerProps {
  source: HierarchyGraphDef;
}

interface SvgContainerState {
  renderInfo: HierarchyGraphNodeInfo;
}

interface GroupNodeProps {
  renderInfo: HierarchyGraphNodeInfo;
  type: 'root' | 'group';
}

interface GraphEdgeProps {
  edge: HierarchyBaseEdgeInfo;
}

interface GraphNodeProps {
  node: HierarchyGraphNodeInfo | HierarchyBaseNodeInfo;
}

const line = d3
  .line<{ x: number; y: number }>()
  .x(d => d.x)
  .y(d => d.y)
  .curve(d3.curveBasis);

export class SvgContainer extends React.Component<SvgContainerProps, SvgContainerState> {
  constructor(props: SvgContainerProps) {
    super(props);
    const { source } = this.props;
    this.state = {
      renderInfo: buildGraph(source, {expanded: ['GROUP0', 'GROUP1']})
    };
  }

  expand = (): void => {
    const { source } = this.props;
    this.setState({
      renderInfo: buildGraph(source, {
        expanded: ['GROUP0', 'GROUP1']
      })
    })
  }

  collapse = (): void => {
    const { source } = this.props;
    this.setState({
      renderInfo: buildGraph(source, {
        expanded: []
      })
    })
  }

  render() {
    return (
        <div className="graph-container">
          <div className="buttons">
            <button onClick={this.expand} className="button-secondary">Expand</button>
            <button onClick={this.collapse} className="button-warning">Collapse</button>
          </div>

          <svg className="graph">
            <g className="zoom">
              <defs>
                <marker
                    id="arrow"
                    viewBox="1 0 20 20"
                    refX="8"
                    refY="3.5"
                    markerWidth="10"
                    markerHeight="10"
                    orient="auto"
                >
                  <polygon points="0 0, 10 3.5, 0 7" />
                </marker>
              </defs>

              <GroupNode renderInfo={this.state.renderInfo} type={'root'} />
            </g>
          </svg>
        </div>
    );
  }
}

// Group node
export class GroupNode extends React.Component<GroupNodeProps> {
  subGraphTransform = (node: HierarchyGraphNodeInfo) => {
    const x = node.x - node.width / 2.0 + node.paddingLeft;
    const y = node.y - node.height / 2.0 + node.paddingTop;
    return `translate(${x}, ${y})`;
  };

  coreTransform = (node: HierarchyGraphNodeInfo) => {
    return `translate(0, ${node.labelHeight})`;
  };

  render() {
    const { type, renderInfo } = this.props;
    const edges = renderInfo.edges.map((edge)=>
      <GraphEdge key={edge.v+'--'+edge.w} edge={edge} />
    );
    const nodes = renderInfo.nodes.map((node)=>
        <GraphNode key={node.name} node={node} />
    );
    return (
      <g className={type} transform={type === 'group' ? this.subGraphTransform(renderInfo) : undefined}>
        <g className="core" transform={this.coreTransform(renderInfo)}>
          <g className="edges">
            {edges}
          </g>
          <g className="nodes">
            {nodes}
          </g>
        </g>
      </g>
    );
  }
}

// Group node
export class GraphEdge extends React.Component<GraphEdgeProps> {
  render() {
    const { edge } = this.props;
    const points = line(edge.points)!;
    return (
      <g className="edge" key={edge.v + '--' + edge.w}>
        <path className="edge-line" data-edge={edge.v + '--' + edge.w} d={points} marker-end="url(#arrow)" />
      </g>
    );
  }
}

// Group node
export class GraphNode extends React.Component<GraphNodeProps> {
   computeCXPositionOfNodeShape = (
      node: HierarchyBaseNodeInfo | HierarchyGraphNodeInfo
  ): number => {
    if ((node as HierarchyGraphNodeInfo).expanded) {
      return node.x;
    }
    const dx = 0;
    return node.x - node.width / 2 + dx + node.coreBox.width / 2;
  };
   nodeTransform = (node: HierarchyBaseNodeInfo | HierarchyGraphNodeInfo) => {
    const x = this.computeCXPositionOfNodeShape(node) - node.width / 2;
    const y = node.y - node.height / 2;
    return `translate(${x}, ${y})`;
  };

  render() {
    const { node } = this.props;
    return (
      <g className={node.type === 2 ? 'node bridge' : 'node'} key={node.name}>
        <g transform={this.nodeTransform(node)}>
          <rect width={node.width} height={node.height} className="node-rect" />
          <text>
            <tspan dy="1em" x="1">
              {node.name}
            </tspan>
          </text>
        </g>
        {
          (node as HierarchyGraphNodeInfo).expanded &&
              <GroupNode renderInfo={node as HierarchyGraphNodeInfo} type={'group'} />
        }
      </g>
    );
  }
}

function App() {
  const data = {
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
  return <SvgContainer source={data} />;
}

export default App;
