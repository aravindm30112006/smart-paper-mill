import { useEffect, useState } from "react";
import axios from "axios";

function AddMaintenance() {
    const [machines, setMachines] = useState([]);

    const [formData, setFormData] = useState({
        machine: "",
        maintenanceType: "Preventive",
        description: "",
        scheduledDate: "",
        technician: "",
        status: "Scheduled"
    });

    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    // Fetch machines
    useEffect(() => {
        const fetchMachines = async () => {
            try {
                const response = await axios.get(
                    "http://localhost:5000/api/machines"
                );

                setMachines(response.data);
            } catch (err) {
                console.error(err);
                setError("Unable to load machines.");
            }
        };

        fetchMachines();
    }, []);

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
                "http://localhost:5000/api/maintenance",
                {
                    machine: formData.machine,
                    maintenanceType: formData.maintenanceType,
                    description: formData.description,
                    scheduledDate: formData.scheduledDate,
                    technician: formData.technician,
                    status: formData.status
                }
            );

            setMessage("Maintenance record added successfully!");

            setFormData({
                machine: "",
                maintenanceType: "Preventive",
                description: "",
                scheduledDate: "",
                technician: "",
                status: "Scheduled"
            });

        } catch (err) {
            console.error(err);

            setError(
                err.response?.data?.message ||
                "Unable to add maintenance record."
            );
        }
    };

    return (
        <div className="page">

            <div className="page-title">

                <div>
                    <h2>Add Maintenance</h2>

                    <p>
                        Schedule and record machine maintenance activities.
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

                    {/* Machine */}

                    <div className="form-group">

                        <label>
                            Machine
                        </label>

                        <select
                            name="machine"
                            value={formData.machine}
                            onChange={handleChange}
                            required
                        >

                            <option value="">
                                Select Machine
                            </option>

                            {machines.map((machine) => (

                                <option
                                    key={machine._id}
                                    value={machine._id}
                                >
                                    {machine.machineName} -{" "}
                                    {machine.productionLine}
                                </option>

                            ))}

                        </select>

                    </div>


                    {/* Maintenance Type */}

                    <div className="form-group">

                        <label>
                            Maintenance Type
                        </label>

                        <select
                            name="maintenanceType"
                            value={formData.maintenanceType}
                            onChange={handleChange}
                        >

                            <option value="Preventive">
                                Preventive
                            </option>

                            <option value="Corrective">
                                Corrective
                            </option>

                            <option value="Emergency">
                                Emergency
                            </option>

                        </select>

                    </div>


                    {/* Description */}

                    <div className="form-group">

                        <label>
                            Description
                        </label>

                        <textarea
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            placeholder="Example: Routine lubrication and inspection"
                            rows="4"
                            required
                        />

                    </div>


                    {/* Scheduled Date */}

                    <div className="form-group">

                        <label>
                            Scheduled Date
                        </label>

                        <input
                            type="date"
                            name="scheduledDate"
                            value={formData.scheduledDate}
                            onChange={handleChange}
                            required
                        />

                    </div>


                    {/* Technician */}

                    <div className="form-group">

                        <label>
                            Technician
                        </label>

                        <input
                            type="text"
                            name="technician"
                            value={formData.technician}
                            onChange={handleChange}
                            placeholder="Example: Arun Kumar"
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

                            <option value="Scheduled">
                                Scheduled
                            </option>

                            <option value="In Progress">
                                In Progress
                            </option>

                            <option value="Completed">
                                Completed
                            </option>

                            <option value="Overdue">
                                Overdue
                            </option>

                        </select>

                    </div>


                    <button
                        type="submit"
                        className="primary-btn"
                    >
                        Add Maintenance
                    </button>

                </form>

            </div>

        </div>
    );
}

export default AddMaintenance;