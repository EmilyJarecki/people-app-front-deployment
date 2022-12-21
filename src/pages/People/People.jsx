import './people.css'
import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'

const People = (props) => {
    // define our state variable - []
    // react state
    const [people, setPeople] = useState([])
    const [newForm, setNewForm] = useState({
        name: "",
        image: "",
        title: "",
    })
    // fetch endpoint
    const BASE_URL = "http://localhost:4000/people"

    // create some local state for tracking people input (user) ++
    // link this state to a controlled form (people) ++
    // handlers (change ++ / submit )
    // submit event will make a post request from our current comp.

    const getPeople = async () => {
        try {
            const response = await fetch(BASE_URL)
            // fetch grabs the data from API - (mongo)
            const allPeople = await response.json()
            // assuming no errors - translate to JS 
            // console.log(allPeople)
            setPeople(allPeople)
            // store that data (from api) in react state
        } catch (err) {
            console.log(err)
        }
    }

    const handleChange = (e) => {
        // console.log(newForm)
        const userInput = { ...newForm }
        userInput[e.target.name] = e.target.value
        setNewForm(userInput)
    }

    const handleSubmit = async (e) => {
        // 0. prevent default (event object method)
        e.preventDefault()
        // 1. capturing our local state
        const currentState = { ...newForm }
        // check any fields for property data types / truthy value (function call - stretch)
        try {
            const requestOptions = {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(currentState)
            }
            // 2. specify request method , headers, Content-Type
            // 3. make fetch to BE - sending data (requestOptions)

            // 3a fetch sends the data to API - (mongo)
            const response = await fetch(BASE_URL, requestOptions)
            // 4. check our response - 
            // 5. parse the data from the response into JS (from JSON) 
            const createdPerson = await response.json()
            console.log(createdPerson)
            // update local state with response (json from be)
            setPeople([...people, createdPerson])
            // reset newForm state so that our form empties out
            setNewForm({
                name: "",
                image: "",
                title: "",
            })

        } catch (err) {
            console.log(err)
        }
    }

    const loaded = () => {
        return (<>
            <section className="people-list">
                {people?.map((person) => {
                    return (
                        <Link key={person._id} to={`/people/${person._id}`}>
                            <div className="person-card">
                                {/* React optimization / difference */}
                                <h1>{person.name}</h1>
                                <img src={person.image} />
                                <h3>{person.title}</h3>
                            </div>
                        </Link>
                    )
                })
                }
            </section>
        </>
        )
    }

    const loading = () => (
        <section className="people-list">
            <h1>
                Loading...
                <span>
                    {" "}
                    <img
                        className="spinner"
                        src="https://freesvg.org/img/1544764567.png"
                    />
                </span>
            </h1>
        </section>
    );

    useEffect(() => {
        getPeople()
    }, [])
    // useEffect takes two arguments -> runs function upon component mount
    // react mount -> 
    return (
        <div>
            <section>
                <h2>Create a new person</h2>
                <form onSubmit={handleSubmit}>
                    <div>
                        <label htmlFor='name'>
                            Name
                            <input
                                type="text"
                                id="name"
                                name="name"
                                placeholder="enter a person's name"
                                value={newForm.name}
                                onChange={handleChange}
                            />
                        </label>
                    </div>
                    <div>
                        <label htmlFor='image'>
                            Image
                            <input
                                type="text"
                                id="image"
                                name="image"
                                placeholder="enter a person's image"
                                value={newForm.image}
                                onChange={handleChange}
                            />
                        </label>
                    </div>
                    <div>
                        <label htmlFor='title'>
                            Title
                            <input
                                type="text"
                                id="title"
                                name="title"
                                placeholder="enter a person's title"
                                value={newForm.title}
                                onChange={handleChange}
                            />
                        </label>
                        <br />
                        <input type="submit" value="Create a new person" />
                    </div>
                </form>
            </section>
            {people && people.length ? loaded() : loading()}
        </div >
    )

}

export default People