// Lesson08_2.tsx
export default function Lesson08_2_Exercise() {

    const params = new URLSearchParams("?sort=price&order=asc"); // way 1
    // const params = new URLSearchParams({ sort: "price", order: "asc" }); // way 2
    // const params = new URLSearchParams([["sort", "price"], ["order", "asc"]]); // way 3

    params.set("order", "desc")
    params.append("inStock", "true")
    // console is enough
    console.log(params.toString());

    return (
        <div style={{ padding: "1rem" }}>
            <h3>Lesson 08.2: Standalone `URLSearchParams`</h3>
        </div>
    );
}