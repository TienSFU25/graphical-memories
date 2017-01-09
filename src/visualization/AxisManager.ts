import * as d3 from 'd3';

export default class AxisManager {
  private width: number;
  private height: number;
  private g;
  private scrollable;

  constructor(selector: string) {
    // set the dimensions and margins of the graph
    this.width = 1760;
    this.height = 100;

    // add the svg canvas
    this.g = d3.select(selector)
      .append('svg')
        .attr('width', 600)
        .attr('height', this.height)
      .append('g')
        .attr('width', this.width)
        .attr('height', this.height);

    this.setup();
  }

  setup() {
    let width = this.width;
    let height = this.height;
    let zoom = d3.zoom()
      .on('zoom', _ => {
        this.scrollable.attr('transform', `translate(${d3.event.transform.x}, 0)`);
      });

    let drag = d3.drag()
      .on('start', _ => console.log(d3.event));

    window['zoom'] = zoom;
    window['g'] = this.g;

    let x = d3.scaleTime()
      .domain([new Date(2000, 0, 1), new Date()])
      .range([0, width]);

    this.g.call(zoom);

    this.scrollable = this.g.append('g')
      .attr('clip-path', 'url(#clip)')
      .attr('class', 'axis scrollable');

    this.scrollable.call(d3.axisBottom(x).ticks(10))
      .selectAll('g')
      .append('image')
      .attr('href', 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/57/React.js_logo.svg/600px-React.js_logo.svg.png')
      .attr('width', 50)
      .attr('height', 50)
      .call(drag);
  }
}
