export default async function Tournament ({ params }) {
    return (
        <div className="flex flex-auto flex-col items-center justify-center w-full h-svh">
            {JSON.stringify(params)}
        </div>
    )
}