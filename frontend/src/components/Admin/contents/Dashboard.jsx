import React, { useState, useEffect } from 'react';
import ButtonDashboard from '../controls/buttons/ButtonDashboard';
import BarChart from '../controls/charts/BarChart';
import { DASHBOARD_BUTTON_LINKS } from '../consts/DashboardButton';
import useFetchAllNumber from '../../../hooks/useFetchAllNumber';
import Instance from "../../../config/axiosCustomize.js";

const Dashboard = () => {
    const [dataBarChart, setDataBarChart] = useState([]);
    const [currentYear, setCurrentYear] = useState(2024);

    const classTitle = 'text-xl font-bold ml-1 py-5 text-gray-400';
    const labelsBarChart = [
        'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
        'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
    ];

    useEffect(() => {
        const fetchData = async () => {
            try {
                console.log('Fetching album release data');
                const response = await Instance.get(`/admin/get-song-release?year=${currentYear}`);
                const data = response.data;
                console.log(data);
                if (data[currentYear]) {
                    setDataBarChart(data[currentYear]);
                } else {
                    setDataBarChart(Array(12).fill(0));
                }
            } catch (error) {
                console.error('Error fetching album release data:', error);
            }
        };
        fetchData();
    }, [currentYear]);

    const { statistic } = useFetchAllNumber();

    const updatedDashboardLinks = DASHBOARD_BUTTON_LINKS.map((link) => {
        switch (link.key) {
            case 'pendingApproval':
                return { ...link, number: statistic.pendingApproval || 0 };
            case 'song':
                return { ...link, number: statistic.songs || 0 };
            case 'album':
                return { ...link, number: statistic.albums || 0 };
            case 'user':
                return { ...link, number: statistic.users || 0 };
            default:
                return link;
        }
    });

    return (
        <div className='flex-shrink max-w-full w-full'>
            <div className={classTitle}>Statistic</div>
            <div className='flex items-center justify-between gap-10'>
                {updatedDashboardLinks.map((link, index) => (
                    <ButtonDashboard key={index} link={link} />
                ))}
            </div>
            <div className={`${classTitle} pt-0`}>Charts</div>
            <div className='2xl:flex 2xl:flex-row 2xl:items-center 2xl:justify-between 2xl:gap-12'>
                <BarChart data={dataBarChart} labels={labelsBarChart} currentYear={currentYear} setCurrentYear={setCurrentYear} />
            </div>
        </div>
    );
};

export default Dashboard;