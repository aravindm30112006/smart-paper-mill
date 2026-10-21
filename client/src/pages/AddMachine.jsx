import { useState } from "react";
import axios from "axios";

function AddMachine() {

    const [formData, setFormData] = useState({
        machineName: "",
        productionLine: "",
        status: "Idle",
        temperature: "",
        utilization: "",
        operatingHours: ""
    });

    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        setMessage("");
        setError("");

        try {

            await axios.post(
                "http://localhost:5000/api/machines",
                {
                    machineName: formData.machineName,
                    productionLine: formData.productionLine,
                    status: formData.status,
                    temperature: Number(formData.temperature),
                    utilization: Number(formData.utilization),
                    operatingHours: Number(formData.operatingHours)
                }
            );

            setMessage("Machine added successfully!");

            setFormData({
                machineName: "",
                productionLine: "",
                status: "Idle",
                temperature: "",
                utilization: "",
                operatingHours: ""
            });

        } catch (err) {

            console.error(err);

            setError(
                err.response?.data?.message ||
                "Unable to add machine."
            );
        }
    };

    return (
        <div className="page">

            <div className="page-title">

                <div>
                    <h2>Add Machine</h2>

                    <p>
                        Add a new paper machine to the Smart Paper Mill.
                    </p>
                </div>

            </div>


            {message && (
                <div className="message">
                    {message}
                </div>
            )}


            {error && (
                <div className="error">
                    {error}
                </div>
            )}


            <div className="form-card">

                <form onSubmit={handleSubmit}>

                    {/* Machine Name */}

                    <div className="form-group">

                        <label>
                            Machine Name
                        </label>

                        <input
                            type="text"
                            name="machineName"
                            value={formData.machineName}
                            onChange={handleChange}
                            placeholder="Example: Paper Machine 04"
                            required
                        />

                    </div>


                    {/* Production Line */}

                    <div className="form-group">

                        <label>
                            Production Line
                        </label>

                        <input
                            type="text"
                            name="productionLine"
                            value={formData.productionLine}
                            onChange={handleChange}
                            placeholder="Example: Production Line D"
                            required
                        />

                    </div>


                    {/* Status */}

                    <div className="form-group">

                        <label>
                            Status
                        </label>

                        <select
                            name="status"
                            value={formData.status}
                            onChange={handleChange}
                        >

                            <option value="Running">
                                Running
                            </option>

                            <option value="Idle">
                                Idle
                            </option>

                            <option value="Maintenance">
                                Maintenance
                            </option>

                        </select>

                    </div>


                    {/* Temperature */}

                    <div className="form-group">

                        <label>
                            Temperature (°C)
                        </label>

                        <input
                            type="number"
                            name="temperature"
                            value={formData.temperature}
                            onChange={handleChange}
                            placeholder="Example: 72"
                            required
                        />

                    </div>


                    {/* Utilization */}

                    <div className="form-group">

                        <label>
                            Utilization (%)
                        </label>

                        <input
                            type="number"
                            name="utilization"
                            min="0"
                            max="100"
                            value={formData.utilization}
                            onChange={handleChange}
                            placeholder="Example: 85"
                            required
                        />

                    </div>


                    {/* Operating Hours */}

                    <div className="form-group">

                        <label>
                            Operating Hours
                        </label>

                        <input
                            type="number"
                            name="operatingHours"
                            min="0"
                            value={formData.operatingHours}
                            onChange={handleChange}
                            placeholder="Example: 1200"
                            required
                        />

                    </div>


                    <button
                        type="submit"
                        className="primary-btn"
                    >
                        Add Machine
                    </button>

                </form>

            </div>

        </div>
    );
}

export default AddMachine;