import { useSearchParams } from "react-router-dom"

const Lesson08_3_Exercise = () => {

    const [searchParams, setSearchParams] = useSearchParams();

    const setView = (key: "grid" | "list") => {
        setSearchParams({ "view": key });
    }

    return (
        <div>
            <button
                onClick={() => {
                    setView("grid")
                }}
            >
                view grid
            </button>
            <button
                onClick={() => {
                    setView("list")
                }}
            >
                view list
            </button>
            <p>
                {searchParams.get("view") || "grid"}
            </p>
        </div>
    )
}

export default Lesson08_3_Exercise