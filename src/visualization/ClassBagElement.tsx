import * as React from 'react';

interface IProps {
  className: string;
  onTransitionEnd: any;
  reflow: boolean;
  images: Array<string>;
}

export default class ClassBag extends React.Component<IProps, any> {
  private element;

  _onTransitionEnd(e) {
    if (e.target == this.element) {
      this.props.onTransitionEnd(e);
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.reflow) {
      this.element.offsetWidth;
    }
  }

  _toThumbnail(imageHref) {
    return(
      <a href="#" className="thumbnail" >
        <img src={imageHref} />
      </a>
    );
  }

  render() {
    return (
      <div className={this.props.className} ref={(d) => { this.element = d; }} onTransitionEnd={this._onTransitionEnd.bind(this)}>
        {this.props.images.map(this._toThumbnail.bind(this))}
      </div>
    );
  }
};
