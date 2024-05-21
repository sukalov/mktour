import Image from "next/image";

type Props = {
  name: string;
  width: number;
  height: number;
  fill?: boolean;
  className: string;
};

export default function Icon({ name, width, height, fill, className }: Props) {
  const src = `/icons/${name}${fill ? "-fill" : ""}.svg`;
  return <Image alt={name} width={width} height={height} src={src} className={className}/>;
}