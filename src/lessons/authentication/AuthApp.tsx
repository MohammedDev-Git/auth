import axios, { AxiosError } from "axios";
import { useEffect, useState } from "react";
import { data, useNavigate } from "react-router-dom"

type Post = {
    "id": string,
    "userId": string,
    "title": string,
    "content": string
}

type User = {
    "id": string,
    "username": string,
    "email": string,
}

const AuthApp = () => {

    const navigate = useNavigate();

    const getUsers = async () => {

    }

    const addUser = async () => {
        try {
            const response = await axios.post("http://localhost:3000/users", {
                "username": "ahamaad",
                "email": "ahzzmaascdd@example.com",
                "password": "123123123"
            })
            console.log(response);
        } catch (err) {
            const errData = err as { response: { data: { message: string } } }
            console.log(errData.response.data.message);
        }
    }

    const editUser = async () => {
        try {
            const response = await axios.patch("http://localhost:3000/users/7e3b694e-e3d3-4620-9f31-65f154e9fc33", {
                "username": "hamedooo",
            })
            console.log(response);
        } catch (err) {
            const errData = err as { response: { data: { message: string } } }
            console.log(errData.response.data.message);
        }
    }

    const deleteUser = async () => {
        try {
            const response = await axios.delete("http://localhost:3000/users/7e3b694e-e3d3-4620-9f31-65f154e9fc33")
            console.log(response);
        } catch (err) {
            const errData = err as { response: { data: { message: string } } }
            console.log(errData.response.data.message);
        }
    }

    const [posts, setPosts] = useState<Post[]>([]);
    const [users, setUsers] = useState<User[]>([]);

    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);

            try {
                const [postsResponse, usersResponse] = await Promise.all([
                    axios.get("http://localhost:3000/posts"),
                    axios.get("http://localhost:3000/users"),
                ])
                setPosts(postsResponse.data.data);
                setUsers(usersResponse.data);

            } catch (err) {
                console.log(err);
            } finally {
                setIsLoading(false);
            }
        }
        fetchData();
    }, [])

    return (
        <div className="flex flex-col items-center justify-center gap-3">
            <p>welcome to auth app</p>
            <button onClick={() => navigate("/login")}>go to login</button>
            <button onClick={() => navigate("/register")}>go to register</button>
            <button onClick={() => navigate("/dashboard")}>go to dashboard</button>
            <button onClick={getUsers}>print users</button>
            <button onClick={addUser}>add user</button>
            <button onClick={editUser}>edit user</button>
            <button onClick={deleteUser}>delete user</button>
            <div>
                {isLoading ? (
                    <p>Loading...</p>
                ) : (
                    <div>
                        <h2>Posts</h2>
                        <ul>
                            {
                                posts.map((post) => (
                                    <li key={post.id}>{post.title}</li>
                                ))
                            }
                        </ul>
                        <h2>Users</h2>
                        <ul>
                            {users.map((user) => (
                                <li key={user.id}>{user.username}</li>
                            ))}
                        </ul>
                    </div>
                )}
            </div>
        </div>
    )
}

export default AuthApp