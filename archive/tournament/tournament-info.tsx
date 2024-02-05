// import { turboPascal } from '@/app/fonts';
// import TypeIcon from '@/components/ui/type-icon';
// import { NewTournamentForm } from '@/lib/zod/new-tournament-form';

// type TournamentInfoProps = {
//   data: NewTournamentForm;
// };

// export default async function TournamentInfo({ data }: TournamentInfoProps) {
//   return (
//     <div className="p">
//       <h1
//         className={`${turboPascal.className} col-span-4 text-left text-3xl font-black uppercase`}
//       >
//         {data.title}
//       </h1>
//       <p className="">{new Date(data.date).toDateString().slice(3, 15)}</p>
//       <div></div>
//       <div className="">
//         <span className=" flex flex-row items-center gap-2">
//           <TypeIcon type={data.type} size={2} />
//           {data.format}
//         </span>
//         {data.user ? (
//           <p className="">created by: {data.user}</p>
//         ) : (
//           <p className="text-destructive">not signed in</p>
//         )}
//       </div>
//     </div>
//   );
// }
