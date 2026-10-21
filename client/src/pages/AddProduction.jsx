import { useEffect, useState } from "react";
import axios from "axios";

function AddProduction() {
    const [machines, setMachines] = useState([]);

    const [formData, setFormData] = useState({
        batchId: "",
        paperType: "A4",
        quantity: "",
        productionDate: "",
        machine: ""
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
                "http://localhost:5000/api/production",
                {
                    batchId: formData.batchId,
                    paperType: formData.paperType,
                    quantity: Number(formData.quantity),
                    productionDate: formData.productionDate,
                    machine: formData.machine
                }
            );

            setMessage("Production batch added successfully!");

            setFormData({
                batchId: "",
                paperType: "A4",
                quantity: "",
                productionDate: "",
                machine: ""
            });

        } catch (err) {
            console.error(err);

            setError(
                err.response?.data?.message ||
                "Unable to add production batch."
            );
        }
    };

    return (
        <div className="page">

            <div className="page-title">

                <div>
                    <h2>Add Production Batch</h2>

                    <p>
                        Record a new paper production batch.
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


                    {/* Paper Type */}

                    <div className="form-group">

                        <label>
                            Paper Type
                        </label>

                        <select
                            name="paperType"
                            value={formData.paperType}
                            onChange={handleChange}
                        >

                            <option value="A4">
                                A4
                            </option>

                            <option value="A3">
                                A3
                            </option>

                            <option value="A5">
                                A5
                            </option>

                            <option value="Newsprint">
                                Newsprint
                            </option>

                            <option value="Packaging">
                                Packaging
                            </option>

                        </select>

                    </div>


                    {/* Quantity */}

                    <div className="form-group">

                        <label>
                            Production Quantity (kg)
                        </label>

                        <input
                            type="number"
                            name="quantity"
                            min="0"
                            value={formData.quantity}
                            onChange={handleChange}
                            placeholder="Example: 15000"
                            required
                        />

                    </div>


                    {/* Production Date */}

                    <div className="form-group">

                        <label>
                            Production Date
                        </label>

                        <input
                            type="date"
                            name="productionDate"
                            value={formData.productionDate}
                            onChange={handleChange}
                            required
                        />

                    </div>


                    {/* Machine */}

                    <div className="form-group">

                        <label>
                            Production Machine
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


                    <button
                        type="submit"
                        className="primary-btn"
                    >
                        Add Production Batch
                    </button>

                </form>

            </div>

        </div>
    );
}

export default AddProduction;