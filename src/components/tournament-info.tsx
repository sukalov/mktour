import { turboPascal } from "@/app/fonts";
import TypeIcon from "@/components/ui/type-icon";
import { RedisTournamentInfo } from "@/lib/actions";

type TournamentInfoProps = {
    data: RedisTournamentInfo
}

export default async function TournamentInfo ({ data }: TournamentInfoProps) {
    return (
        <div className="p">
            <h1 className={`${turboPascal.className} text-left font-black text-3xl col-span-4 uppercase`}>{data.tournament}</h1>
            <p className="font-light">{new Date(data.date).toDateString().slice(3,15)}</p>
            <div>
            </div>
            <div className="">
                    <span className="flex flex-row gap-2 text-xs">
                        <TypeIcon type={data.type} size={-3}/>
                        {data.format}
                    </span>
            { data.user ? <p>created by: {data.user}</p> : <p className="text-destructive">not signed in</p>}
            </div>
            </div>
    )
}