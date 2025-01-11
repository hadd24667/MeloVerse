import { useEffect, useState } from "react";
import Instance from "../config/axiosCustomize.js";

const useFetchAllNumber = () => {
    const [statistic, setStatistic] = useState([]);

    useEffect(() => {
        const fetchStatistic = async () => {
            try {
                console.log('Fetching statistic');
                const response = await Instance.get('/admin/get-statistic');
                setStatistic(response.data);
            } catch (error) {
                console.log(error);
            }
        };
        fetchStatistic();
    }, []);

    return { statistic };
};

export default useFetchAllNumber;