import { Promise } from 'bluebird';

export function getImages() {
  return new Promise((res, rej) => {
    setTimeout(() => {
      const IMAGES = [
        "https://openclipart.org/image/90px/svg_to_png/271083/donkey-pegasus-on-a-mission.png",
        "https://openclipart.org/image/90px/svg_to_png/271083/donkey-pegasus-on-a-mission.png",
        "https://openclipart.org/image/90px/svg_to_png/271075/donkey-pegasus-brown-and-gold.png",
        "https://openclipart.org/image/90px/svg_to_png/271083/donkey-pegasus-on-a-mission.png",
        "https://openclipart.org/image/90px/svg_to_png/271083/donkey-pegasus-on-a-mission.png",
        "https://openclipart.org/image/90px/svg_to_png/271083/donkey-pegasus-on-a-mission.png",
        "https://openclipart.org/image/90px/svg_to_png/271083/donkey-pegasus-on-a-mission.png",
        "https://openclipart.org/image/90px/svg_to_png/271075/donkey-pegasus-brown-and-gold.png",
        "https://openclipart.org/image/90px/svg_to_png/271083/donkey-pegasus-on-a-mission.png",
        "https://openclipart.org/image/90px/svg_to_png/271083/donkey-pegasus-on-a-mission.png",
        "https://openclipart.org/image/90px/svg_to_png/271083/donkey-pegasus-on-a-mission.png",
        "https://openclipart.org/image/90px/svg_to_png/271075/donkey-pegasus-brown-and-gold.png",
        "https://openclipart.org/image/90px/svg_to_png/271083/donkey-pegasus-on-a-mission.png",
        "https://openclipart.org/image/90px/svg_to_png/271083/donkey-pegasus-on-a-mission.png",
        "https://openclipart.org/image/90px/svg_to_png/271083/donkey-pegasus-on-a-mission.png",
        "https://openclipart.org/image/90px/svg_to_png/271083/donkey-pegasus-on-a-mission.png",
        "https://openclipart.org/image/90px/svg_to_png/271083/donkey-pegasus-on-a-mission.png"
      ];

      res(IMAGES);
    }, 1000);
  });
}
