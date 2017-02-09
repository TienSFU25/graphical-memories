export function mapToNetworkData(input: any) {
  console.log('implement this shit yo');
  return -1;
}

export function mapOpenClipArtResponseToImages(response) {
  return response.payload.map(item => {
    return item.svg.png_thumb;
  });
}
