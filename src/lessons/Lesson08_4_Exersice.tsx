import { useState } from 'react'
import { useSearchParams } from 'react-router-dom';

const Lesson08_4_Exersice = () => {

    const baseURL = new URL("http://localhost:3000");

    const endpoint = new URL("search", baseURL);

    const [searchParams, setSearchParams] = useSearchParams();
    endpoint.search = searchParams.toString();

    const [value, setValue] = useState("");

    return (
        <div>
            <input
                value={value}
                onChange={(e) => {
                    setValue(e.target.value);
                }}
            />
            <button
                onClick={() => {
                    const params = new URLSearchParams(searchParams);
                    params.set("q", value);
                    setSearchParams(params);
                }}
            >
                submit
            </button>
            <p>
                {endpoint.href}
            </p>
        </div>
    )
}

export default Lesson08_4_Exersice