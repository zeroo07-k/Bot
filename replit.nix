{ pkgs }: {
  deps = [
    pkgs.nodejs-18_x
    pkgs.ffmpeg
    pkgs.imagemagick
    pkgs.git
    pkgs.libwebp
  ];
}
