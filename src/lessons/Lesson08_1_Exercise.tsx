
const Lesson08_1_Exercise = () => {

    const url = new URL("https://shop.com/products/shoes?category=running&size=42");

    // no need for p tag, console is fine
    console.log(url.pathname);
    console.log(url.search);

    return (
        <div>Lesson08_1_Exercise</div>
    )
}

export default Lesson08_1_Exercise