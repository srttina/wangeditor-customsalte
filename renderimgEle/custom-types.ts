type EmptyText = {
  text: "";
};

export type ImageStyle = {
  width?: string;
  height?: string;
};

export type ImageElement = {
  type: "customimage";
  src: string;
  alt?: string;
  href?: string;
  style?: ImageStyle;
  altDes?: string;
  children: EmptyText[];
};
