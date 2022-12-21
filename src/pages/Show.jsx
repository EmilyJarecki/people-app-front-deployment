import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";

const Show = (props) => {
  const [person, setPerson] = useState(null);
  const [loading, setLoading] = useState(true);

  const placeholderImage =
    "https://st3.depositphotos.com/6672868/13701/v/450/depositphotos_137014128-stock-illustration-user-profile-icon.jpg";
  const { id } = useParams();
  const navigate = useNavigate();
  const URL = `http://localhost:4000/people/${id}`;
  const [newForm, setForm] = useState({
    name: "",
    image: "",
    title: "",
  });

  const handleChange = (e) =>
    setForm({ ...newForm, [e.target.name]: e.target.value });

  const updatePerson = async (event) => {
    event.preventDefault();
    try {
      const requestOptions = {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newForm),
      };
      await fetch(URL, requestOptions);
      getPerson();
      setForm({
        name: "",
        image: "",
        title: "",
      });
    } catch (err) {
      console.error(err);
    }
  };

  const getPerson = async () => {
    try {
      const response = await fetch(URL);
      const result = await response.json();
      console.log(`Get person:`, result);
      setPerson(result);
      setLoading(false);
    } catch (err) {
      console.log(err);
    }
  };

  const removePerson = async (e) => {
    try {
      const options = {
        method: "DELETE",
      };
      const response = await fetch(URL, options);
      const deletedPerson = await response.json();

      navigate("/");
    } catch (err) {
      console.log(err);
    }
  };

  const isLoading = () => <h2>...Loading</h2>;
  const loaded = () => (
    <>
      <div className="person-card">
        <h1>{person.name}</h1>
        <div>
          <p>Delete Person</p>
          <button onClick={removePerson}> X </button>
        </div>
        <img src={person.image || placeholderImage} />
        <h3>{person.title || "No title given"}</h3>
      </div>
      <Link to="/">Back to Home</Link>
      <section>
        <h2>Edit this Person</h2>
        <form onSubmit={updatePerson}>
          <input
            key ={newForm._id}
            type="text"
            value={newForm.name}
            name="name"
            placeholder="name"
            onChange={handleChange}
          />
          <input
            key ={newForm._id}
            type="text"
            value={newForm.image}
            name="image"
            placeholder="image URL"
            onChange={handleChange}
          />
          <input
            key ={newForm._id}
            type="text"
            value={newForm.title}
            name="title"
            placeholder="title"
            onChange={handleChange}
          />
          <input type="submit" value="Update Person" />
        </form>
      </section>
    </>
  );
  useEffect(() => {
    getPerson();
  }, []);

  return (
    <section className="ShowContainer">
      {loading ? isLoading() : loaded()}
    </section>
  );
};

export default Show;
