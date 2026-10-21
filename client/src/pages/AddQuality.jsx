import { useState } from "react";
import axios from "axios";

function AddQuality() {
    const [formData, setFormData] = useState({
        batchId: "",
        paperType: "A4",
        thickness: "",
        moisture: "",
        strength: "",
        defectCount: ""
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
                "http://localhost:5000/api/quality",
                {
                    batchId: formData.batchId,
                    paperType: formData.paperType,
                    thickness: Number(formData.thickness),
                    moisture: Number(formData.moisture),
                    strength: Number(formData.strength),
                    defectCount: Number(formData.defectCount)
                }
            );

            setMessage("Quality inspection added successfully!");

            setFormData({
                batchId: "",
                paperType: "A4",
                thickness: "",
                moisture: "",
                strength: "",
                defectCount: ""
            });

        } catch (err) {
            console.error(err);

            setError(
                err.response?.data?.message ||
                "Unable to add quality inspection."
            );
        }
    };

    return (
        <div className="page">

            <div className="page-title">

                <div>
                    <h2>Add Quality Inspection</h2>

                    <p>
                        Record quality inspection results for a paper batch.
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


                    {/* Thickness */}

                    <div className="form-group">

                        <label>
                            Thickness (mm)
                        </label>

                        <input
                            type="number"
                            step="0.01"
                            min="0"
                            name="thickness"
                            value={formData.thickness}
                            onChange={handleChange}
                            placeholder="Example: 0.10"
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
                            min="0"
                            name="moisture"
                            value={formData.moisture}
                            onChange={handleChange}
                            placeholder="Example: 6.2"
                            required
                        />

                    </div>


                    {/* Strength */}

                    <div className="form-group">

                        <label>
                            Strength
                        </label>

                        <input
                            type="number"
                            step="0.1"
                            min="0"
                            name="strength"
                            value={formData.strength}
                            onChange={handleChange}
                            placeholder="Example: 82"
                            required
                        />

                    </div>


                    {/* Defect Count */}

                    <div className="form-group">

                        <label>
                            Defect Count
                        </label>

                        <input
                            type="number"
                            min="0"
                            name="defectCount"
                            value={formData.defectCount}
                            onChange={handleChange}
                            placeholder="Example: 3"
                            required
                        />

                    </div>


                    <button
                        type="submit"
                        className="primary-btn"
                    >
                        Add Quality Inspection
                    </button>

                </form>

            </div>

        </div>
    );
}

export default AddQuality;