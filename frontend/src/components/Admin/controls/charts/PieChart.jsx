import React, { useEffect, useRef } from 'react';
import { Chart } from 'chart.js/auto';
import ComboBox from '../inputs/ComboBox';

const PieChart = ({ data, labels }) => {
    const chartRef = useRef(null);

    useEffect(() => {
        if (!chartRef.current) return;

        const chartInstance = new Chart(chartRef.current, {
            type: 'pie',
            data: {
                labels,
                datasets: [{
                    label: 'Users',
                    data,
                    backgroundColor: ['rgb(34, 197, 94)', 'rgb(138, 242, 176)', 'rgb(234, 252, 240)'],
                    borderColor: ['rgb(34, 197, 94)', 'rgb(138, 242, 176)', 'rgb(234, 252, 240)'],
                    borderWidth: 1,
                }]
            },
            options: {  
                responsive: true,
                maintainAspectRatio: false, 
                plugins: {
                    legend: {
                        labels: { font: { size: 16 }, padding: 30, color: 'black'},
                        position: 'bottom'
                    }
                },
            }
        });

        return () => chartInstance.destroy();
    }, [data, labels]);

    return (
        <div className='relative bg-gray px-10 py-10 mb-10 rounded-xl shadow-lg h-[400px] 
                        2xl:w-[500px]'>
            <div className='absolute right-10 top-5'>
                <ComboBox options={['2025', '2024']}/>
            </div>  
            <canvas ref={chartRef} />
        </div>
    )
};

export default PieChart;
