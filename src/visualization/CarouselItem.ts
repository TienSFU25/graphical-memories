export default class CarouselItem {
  private classNames: Set<string>;
  private imageList: Array<string>;
  public reflow: boolean;

  constructor(images?: Array<string>) {
    this.classNames = new Set<string>();
    this.classNames.add('item');
    this.reflow = false;
    this.imageList = [];
    this.addImages(images);
  }

  addImages(images) {
    if (images) {
      this.imageList = this.imageList.concat(images);
    }
  }

  getImages() {
    return this.imageList;
  }

  addClasses(...cs: Array<string>): void {
    for (let c of cs) {
      this.classNames.add(c);
    }
  }

  removeClasses(...cs: Array<string>): void {
    for (let c of cs) {
      this.classNames.delete(c);
    }
  }

  getClassName(): string {
    return ([...this.classNames]).join(' ');
  }
}
