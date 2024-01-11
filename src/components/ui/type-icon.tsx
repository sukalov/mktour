import { MdGroup, MdGroups, MdPerson } from "react-icons/md"

interface TypeIconProps {
    // type: 'solo' | 'doubles' | 'team'
    type: string
    size?: number
}

export default function TypeIcon ({ type, size = 0 }: TypeIconProps) {

    if (type === 'solo') return <MdPerson size={size + 14} />
    if (type === 'doubles') return <MdGroup size={size + 16} />
    if (type === 'team') return <MdGroups size=  {size + 19} />
    else return <></>
}