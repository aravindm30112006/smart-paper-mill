import { useState } from "react";
import axios from "axios";

function AddPulp() {
    const [formData, setFormData] = useState({
        batchId: "",
        temperature: "",
        pressure: "",
        moisture: "",
        ph: "",
        flowRate: "",
        status: "Normal"
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
                "http://localhost:5000/api/pulp",
                {
                    batchId: formData.batchId,
                    temperature: Number(formData.temperature),
                    pressure: Number(formData.pressure),
                    moisture: Number(formData.moisture),
                    ph: Number(formData.ph),
                    flowRate: Number(formData.flowRate),
                    status: formData.status
                }
            );

            setMessage("Pulp data added successfully!");

            setFormData({
                batchId: "",
                temperature: "",
                pressure: "",
                moisture: "",
                ph: "",
                flowRate: "",
                status: "Normal"
            });

        } catch (err) {
            console.error(err);

            setError(
                err.response?.data?.message ||
                "Unable to add pulp data."
            );
        }
    };

    return (
        <div className="page">

            <div className="page-title">
                <div>
                    <h2>Add Pulp Data</h2>

                    <p>
                        Record pulp processing parameters for a batch.
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

                    {/* Batch ID */}

                    <div className="form-group">
                        <label>
                            Batch ID
                        </label>

                        <input
                            type="text"
                            name="batchId"
                            value={formData.batchId}
                            onChange={handleChange}
                            placeholder="Example: BATCH004"
                            required
                        />
                    </div>


                    {/* Temperature */}

                    <div className="form-group">
                        <label>
                            Temperature (°C)
                        </label>

                        <input
                            type="number"
                            step="0.1"
                            name="temperature"
                            value={formData.temperature}
                            onChange={handleChange}
                            placeholder="Example: 72"
                            required
                        />
                    </div>


                    {/* Pressure */}

                    <div className="form-group">
                        <label>
                            Pressure (bar)
                        </label>

                        <input
                            type="number"
                            step="0.1"
                            name="pressure"
                            value={formData.pressure}
                            onChange={handleChange}
                            placeholder="Example: 4.2"
                            required
                        />
                    </div>


                    {/* Moisture */}

                    <div className="form-group">
                        <label>
                            Moisture (%)
                        </label>

                        <input
                            type="number"
                            step="0.1"
                            name="moisture"
                            value={formData.moisture}
                            onChange={handleChange}
                            placeholder="Example: 6.5"
                            required
                        />
                    </div>


                    {/* pH */}

                    <div className="form-group">
                        <label>
                            pH
                        </label>

                        <input
                            type="number"
                            step="0.1"
                            min="0"
                            max="14"
                            name="ph"
                            value={formData.ph}
                            onChange={handleChange}
                            placeholder="Example: 7.1"
                            required
                        />
                    </div>


                    {/* Flow Rate */}

                    <div className="form-group">
                        <label>
                            Flow Rate
                        </label>

                        <input
                            type="number"
                            step="0.1"
                            name="flowRate"
                            value={formData.flowRate}
                            onChange={handleChange}
                            placeholder="Example: 850"
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
                            <option value="Normal">
                                Normal
                            </option>

                            <option value="Warning">
                                Warning
                            </option>

                            <option value="Critical">
                                Critical
                            </option>
                        </select>
                    </div>


                    <button
                        type="submit"
                        className="primary-btn"
                    >
                        Add Pulp Data
                    </button>

                </form>

            </div>

        </div>
    );
}

export default AddPulp;