export class TreeHelper {
  static getRid(node) {
    const ancestors = node.ancestors();
    return ancestors[ancestors.length - 1].rid;
  }
}
