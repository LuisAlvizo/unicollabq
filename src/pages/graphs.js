import React, { useState, useEffect, memo } from 'react';
import { Box, Typography, Paper, CircularProgress, Grid } from '@mui/material';
import { Bar, Line } from 'react-chartjs-2';
import 'chart.js/auto';

const Graphs = memo(function Graphs() {
  const [loading, setLoading] = useState(true);
  const [categoryData, setCategoryData] = useState({ categorias: [], cantidades: [] });
  const [monthlyData, setMonthlyData] = useState({ meses: [], conteos: [] });

  useEffect(() => {
    fetch('http://localhost:3030/api/posts')
      .then(response => response.json())
      .then(data => {
        if (data.success && data.posts) {
          const posts = data.posts;
          
          // Agrupar posts por categoría
          const categoryCount = {};
          posts.forEach(post => {
            const cat = post.Categoria || 'Sin categoría';
            categoryCount[cat] = (categoryCount[cat] || 0) + 1;
          });

          const categorias = Object.keys(categoryCount);
          const cantidades = Object.values(categoryCount);

          // Agrupar posts por mes (asumiendo que FechaCreacion existe)
          const monthlyCount = {};
          posts.forEach(post => {
            const fecha = new Date(post.FechaCreacion);
            // Tomar año-mes
            const mes = fecha.toLocaleString('default', { month: 'short', year: 'numeric' });
            monthlyCount[mes] = (monthlyCount[mes] || 0) + 1;
          });

          // Ordenar por fecha (opcional)
          const orderedMonths = Object.keys(monthlyCount).sort((a, b) => {
            // Convertir mes-año a Date para ordenar
            const [mesA, yearA] = a.split(' ');
            const [mesB, yearB] = b.split(' ');
            const dateA = new Date(yearA, new Date(Date.parse(mesA +" 1, 2012")).getMonth());
            const dateB = new Date(yearB, new Date(Date.parse(mesB +" 1, 2012")).getMonth());
            return dateA - dateB;
          });

          const conteos = orderedMonths.map(m => monthlyCount[m]);

          setCategoryData({ categorias, cantidades });
          setMonthlyData({ meses: orderedMonths, conteos });
          setLoading(false);
        } else {
          setLoading(false);
        }
      })
      .catch(error => {
        console.error('Error al obtener posts:', error);
        setLoading(false);
      });
  }, []);

  const barData = {
    labels: categoryData.categorias,
    datasets: [
      {
        label: 'Posts por Categoría',
        data: categoryData.cantidades,
        backgroundColor: 'rgba(54, 162, 235, 0.6)',
        borderColor: 'rgba(54, 162, 235, 1)',
        borderWidth: 1,
        hoverBackgroundColor: 'rgba(54, 162, 235, 0.8)'
      }
    ]
  };

  const barOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: true },
      tooltip: { enabled: true }
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: { stepSize: 1 }
      }
    }
  };

  const lineData = {
    labels: monthlyData.meses,
    datasets: [
      {
        label: 'Posts por Mes',
        data: monthlyData.conteos,
        fill: false,
        borderColor: 'rgba(255,99,132,1)',
        backgroundColor: 'rgba(255,99,132,0.2)',
        tension: 0.1,
        pointRadius: 5,
        pointHoverRadius: 7
      }
    ]
  };

  const lineOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: true },
      tooltip: { enabled: true }
    },
    scales: {
      y: {
        beginAtZero: true
      }
    }
  };

  return (
    <Box sx={{ maxWidth: 1200, margin: '0 auto', padding: '2rem', bgcolor: '#f5f5f5', borderRadius: 2 }}>
      <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold', marginBottom: '2rem', textAlign: 'center' }}>
        Panel de Estadísticas
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ textAlign: 'center', marginBottom: '2rem' }}>
        Visualiza las métricas clave de tus publicaciones en diferentes dimensiones.
      </Typography>

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 300 }}>
          <CircularProgress />
        </Box>
      ) : (
        <Grid container spacing={4}>
          <Grid item xs={12} md={6}>
            <Paper 
              elevation={3} 
              sx={{ padding: '1.5rem', borderRadius: '8px', height: '400px', display: 'flex', flexDirection: 'column' }}
            >
              <Typography variant="h6" sx={{ fontWeight: 'bold', marginBottom: '1rem' }} align="center">
                Distribución por Categoría
              </Typography>
              {categoryData.categorias.length > 0 ? (
                <Box sx={{ flex: 1, minHeight: 0 }}>
                  <Bar data={barData} options={barOptions} />
                </Box>
              ) : (
                <Typography variant="body2" color="text.secondary" align="center">
                  No hay datos disponibles para mostrar.
                </Typography>
              )}
            </Paper>
          </Grid>

          <Grid item xs={12} md={6}>
            <Paper 
              elevation={3} 
              sx={{ padding: '1.5rem', borderRadius: '8px', height: '400px', display: 'flex', flexDirection: 'column' }}
            >
              <Typography variant="h6" sx={{ fontWeight: 'bold', marginBottom: '1rem' }} align="center">
                Evolución de Publicaciones por Mes
              </Typography>
              {monthlyData.meses.length > 0 ? (
                <Box sx={{ flex: 1, minHeight: 0 }}>
                  <Line data={lineData} options={lineOptions} />
                </Box>
              ) : (
                <Typography variant="body2" color="text.secondary" align="center">
                  No hay datos disponibles para mostrar.
                </Typography>
              )}
            </Paper>
          </Grid>
        </Grid>
      )}
    </Box>
  );
});

export default Graphs;
