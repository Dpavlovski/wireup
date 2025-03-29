import {useState} from 'react';
import {
    Bar,
    BarChart,
    CartesianGrid,
    Cell,
    Legend,
    Pie,
    PieChart,
    PolarAngleAxis,
    PolarGrid,
    PolarRadiusAxis,
    Radar,
    RadarChart,
    Tooltip,
    XAxis,
    YAxis
} from 'recharts';
import ProtectedRoute from "../../../utils/ProtectedRoute";

export default function Index() {
    // const [evaluations, setEvaluations] = useState([]);
    // const [selectedEmployee, setSelectedEmployee] = useState(null);
    //
    // // useEffect(() => {
    // //     const fetchData = async () => {
    // //         try {
    // //             const response = await axios.get('http://localhost:8000/evaluations');
    // //             setEvaluations(response.data);
    // //         } catch (error) {
    // //             console.error('Error fetching data:', error);
    // //         }
    // //     };
    // //     fetchData();
    // // }, []);
    //
    // // Data processing functions
    // const processRadarData = (categories) => {
    //     return Object.entries(categories).map(([key, value]) => ({
    //         subject: key,
    //         value: value,
    //         fullMark: 5
    //     }));
    // };
    //
    // const processPieData = (categories) => {
    //     return Object.entries(categories).map(([key, value]) => ({
    //         name: key,
    //         value: value
    //     }));
    // };
    //
    // const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

    return (
        <ProtectedRoute allowedRoles={"admin"}>
            <div className="container mx-auto p-4">
                <h1 className="text-3xl font-bold mb-8">Not yet implemented</h1>

                {/*/!* Employee Selector *!/*/}
                {/*<div className="mb-8">*/}
                {/*    <h2 className="text-xl mb-4">Select Employee</h2>*/}
                {/*    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">*/}
                {/*        {evaluations.map((evaluation) => (*/}
                {/*            <button*/}
                {/*                key={evaluation.employee_id}*/}
                {/*                onClick={() => setSelectedEmployee(evaluation)}*/}
                {/*                className={`p-4 rounded-lg ${*/}
                {/*                    selectedEmployee?.employee_id === evaluation.employee_id*/}
                {/*                        ? 'bg-blue-500 text-white'*/}
                {/*                        : 'bg-gray-200 hover:bg-gray-300'*/}
                {/*                }`}*/}
                {/*            >*/}
                {/*                {evaluation.employee_name}*/}
                {/*            </button>*/}
                {/*        ))}*/}
                {/*    </div>*/}
                {/*</div>*/}

                {/*{selectedEmployee && (*/}
                {/*    <div className="space-y-8">*/}
                {/*        /!* Overall Score Bar Chart *!/*/}
                {/*        <div className="bg-white p-6 rounded-lg shadow-md">*/}
                {/*            <h2 className="text-xl mb-4">Overall Scores Over Time</h2>*/}
                {/*            <BarChart width={800} height={300} data={evaluations}>*/}
                {/*                <CartesianGrid strokeDasharray="3 3"/>*/}
                {/*                <XAxis dataKey="evaluation_date"/>*/}
                {/*                <YAxis domain={[0, 5]}/>*/}
                {/*                <Tooltip/>*/}
                {/*                <Legend/>*/}
                {/*                <Bar dataKey="overall_score" fill="#8884d8"/>*/}
                {/*            </BarChart>*/}
                {/*        </div>*/}

                {/*        /!* Skills Radar Chart *!/*/}
                {/*        <div className="bg-white p-6 rounded-lg shadow-md">*/}
                {/*            <h2 className="text-xl mb-4">Skill Assessment</h2>*/}
                {/*            <RadarChart*/}
                {/*                outerRadius={150}*/}
                {/*                width={800}*/}
                {/*                height={400}*/}
                {/*                data={processRadarData(selectedEmployee.categories)}*/}
                {/*            >*/}
                {/*                <PolarGrid/>*/}
                {/*                <PolarAngleAxis dataKey="subject"/>*/}
                {/*                <PolarRadiusAxis angle={30} domain={[0, 5]}/>*/}
                {/*                <Radar*/}
                {/*                    name="Score"*/}
                {/*                    dataKey="value"*/}
                {/*                    stroke="#8884d8"*/}
                {/*                    fill="#8884d8"*/}
                {/*                    fillOpacity={0.6}*/}
                {/*                />*/}
                {/*                <Tooltip/>*/}
                {/*            </RadarChart>*/}
                {/*        </div>*/}

                {/*        /!* Category Distribution Pie Chart *!/*/}
                {/*        <div className="bg-white p-6 rounded-lg shadow-md">*/}
                {/*            <h2 className="text-xl mb-4">Category Distribution</h2>*/}
                {/*            <PieChart width={800} height={400}>*/}
                {/*                <Pie*/}
                {/*                    data={processPieData(selectedEmployee.categories)}*/}
                {/*                    cx="50%"*/}
                {/*                    cy="50%"*/}
                {/*                    outerRadius={150}*/}
                {/*                    fill="#8884d8"*/}
                {/*                    dataKey="value"*/}
                {/*                    label*/}
                {/*                >*/}
                {/*                    {processPieData(selectedEmployee.categories).map((entry, index) => (*/}
                {/*                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]}/>*/}
                {/*                    ))}*/}
                {/*                </Pie>*/}
                {/*                <Tooltip/>*/}
                {/*                <Legend/>*/}
                {/*            </PieChart>*/}
                {/*        </div>*/}
                {/*    </div>*/}
                {/*)}*/}
            </div>
        </ProtectedRoute>
    );
};
