import React from "react";
import { Fragment, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { connect } from "react-redux";
import { setAlert } from "../../actions/alert";
import { register } from "../../actions/auth";
import PropTypes from "prop-types";

const Register = ({ setAlert, register }) => {
	const [formData, setFormData] = useState({
		name: "",
		email: "",
		password: "",
		password2: ""
	});

	const { name, email, password, password2 } = formData;

	const onChange = (e) =>
		setFormData({ ...formData, [e.target.name]: e.target.value });

	const onSubmit = async (e) => {
		e.preventDefault();
		if (password !== password2) {
			setAlert("Passwords do not match", "danger");
		} else {
			register({ name, email, password, password2 });
			// const newUser = {
			// 	name,
			// 	email,
			// 	password
			// };
			// try {
			// 	const config = {
			// 		headers: {
			// 			"Content-type": "application/json"
			// 		}
			// 	};
			// 	const body = JSON.stringify(newUser);

			// 	const res = await axios.post("/api/users", body, config);
			// 	console.log(res.data);
			// } catch (err) {
			// 	console.error(err.response.data);
			// }
		}
		console.log(formData);
	};

	return (
		<Fragment>
			<h1 className="large text-primary">Sign Up</h1>
			<p className="lead">
				<i className="fas fa-user"></i> Create Your Account
			</p>
			<form className="form" onSubmit={(e) => onSubmit(e)}>
				<div className="form-group">
					<input
						type="text"
						placeholder="Name"
						name="name"
						value={name}
						onChange={(e) => onChange(e)}
						// required
					/>
				</div>
				<div className="form-group">
					<input
						type="email"
						placeholder="Email Address"
						name="email"
						onChange={(e) => onChange(e)}
						value={email}
						// required
					/>
					<small className="form-text">
						This site uses Gravatar so if you want a profile image, use a
						Gravatar email
					</small>
				</div>
				<div className="form-group">
					<input
						type="password"
						placeholder="Password"
						name="password"
						onChange={(e) => onChange(e)}
						// minLength="6"
						value={password}
					/>
				</div>
				<div className="form-group">
					<input
						type="password"
						placeholder="Confirm Password"
						name="password2"
						value={password2}
						onChange={(e) => onChange(e)}
						// minLength="6"
					/>
				</div>
				<input type="submit" className="btn btn-primary" value="Register" />
			</form>
			<p className="my-1">
				Already have an account? <Link to="/login">Sign In</Link>
			</p>
		</Fragment>
	);
};
Register.propTypes = {
	setAlert: PropTypes.func.isRequired,
	register: PropTypes.func.isRequired
};
//first param is state, 2nd is actions you want to use
export default connect(
	null,
	{ setAlert, register }
)(Register);
