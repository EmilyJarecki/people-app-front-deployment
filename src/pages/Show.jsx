import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

function Show(props) {
  const [person, setPerson] = useState(null);
  const [editForm, setEditForm] = useState("");

  const navigate = useNavigate();

  const params = useParams();
  const { id } = params;

  const URL = `http://localhost:4000/people/${id}`;

  // console.log("id", id, URL)
  // console.log(`Current Person: ${JSON.stringify(person)}`)

  const handleChange = (e) =>
    setEditForm({ ...editForm, [e.target.name]: e.target.value });

  const updatePerson = async (e) => {
    e.preventDefault();
    // console.log(editForm)
    try {
      const options = {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editForm),
      };
      const response = await fetch(URL, options);
      const updatedPerson = await response.json();

      setPerson(updatedPerson);
      setEditForm(updatedPerson);
    } catch (err) {
      console.log(err);
      navigate(URL);
    }
  };

  const getPerson = async () => {
    try {
      const response = await fetch(URL);
      const foundPerson = await response.json();

      setPerson(foundPerson);
      setEditForm(foundPerson);
    } catch (err) {
      console.log(err);
    }
  };

  const removePerson = async () => {
    try {
      const options = {
        method: "DELETE",
      };
      const response = await fetch(URL, options);
      const deletedPerson = await response.json();
      // console.log(deletedPerson)
      navigate("/");

      // navigate will change the browser's URL
      // which will cause react-router to "redirect" to home page;
      // the Main will then re-render the People component
      // upon mount People will fetch the updated index of people data
    } catch (err) {
      console.log(err);
      navigate(URL);
    }
  };

  useEffect(() => {
    getPerson();
  }, []);

  const loaded = () => (
    <>
      <section>
        <div className="person">
          <h1>Show Page</h1>
          <h2>{person.name}</h2>
          <h2>{person.title}</h2>
          <img src={person.image} alt={person.name + " image"} />
          <div>
            <button className="delete" onClick={removePerson}>
              Remove Person
            </button>
          </div>
        </div>
      </section>
      <section>
        <h2>Edit this Person</h2>
        <form onSubmit={updatePerson}>
          <input
            type="text"
            value={editForm.name}
            name="name"
            placeholder="name"
            onChange={handleChange}
          />
          <input
            type="text"
            value={editForm.image}
            name="image"
            placeholder="image URL"
            onChange={handleChange}
          />
          <input
            type="text"
            value={editForm.title}
            name="title"
            placeholder="title"
            onChange={handleChange}
          />
          <input type="submit" value="Update Person" />
        </form>
      </section>
    </>
  );

  const loading = () => (
    <>
      <h1>Loading...</h1>
    </>
  );
  return <div>{person ? loaded() : loading()}</div>;
}

export default Show;
