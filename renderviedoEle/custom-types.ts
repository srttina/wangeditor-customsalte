type EmptyText = {
  text: "";
};
export type videomentElement = {
  type: "customvideo";
  poster?: string;
  src?: string;
  videoId?: string;
  controls?: boolean;
  width?: string;
  height?: string;
  altDes?: string;
  children: EmptyText[];
};
