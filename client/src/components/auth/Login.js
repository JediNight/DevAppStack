import React from "react";
import { Fragment, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const Login = () => {
	const [formData, setFormData] = useState({
		email: "",
		password: ""
	});

	const { email, password } = formData;

	const onChange = (e) =>
		setFormData({ ...formData, [e.target.name]: e.target.value });

	const onSubmit = async (e) => {
		e.preventDefault();
		const loginUser = {
			email,
			password
		};
		try {
			const config = {
				headers: {
					"Content-type": "application/json"
				}
			};
			const body = JSON.stringify(loginUser);

			const res = await axios.post("/api/auth", body, config);
			console.log(res.data);
		} catch (err) {
			console.error(err.response.data);
		}
	};
	console.log(formData);

	return (
		<Fragment>
			<h1 className="large text-primary">Sign In</h1>
			<p className="lead">
				<i className="fas fa-user"></i> Sign into Your Account
			</p>
			<form
				className="form"
				action="dashboard.html"
				onSubmit={(e) => onSubmit(e)}
			>
				<div className="form-group">
					<input
						type="email"
						placeholder="Email Address"
						name="email"
						required
						onChange={(e) => onChange(e)}
					/>
				</div>
				<div className="form-group">
					<input
						type="password"
						placeholder="Password"
						name="password"
						onChange={(e) => onChange(e)}
					/>
				</div>
				<input type="submit" className="btn btn-primary" value="Login" />
			</form>
			<p className="my-1">
				Don't have an account? <Link to="/register">Sign Up</Link>
			</p>
			;
		</Fragment>
	);
};

export default Login;
