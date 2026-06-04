(function () {
  'use strict';

  const THEME_KEY = 'curriculo-theme';
  const html = document.documentElement;
  const themeToggle = document.getElementById('themeToggle');
  let charts = {};

  const RADAR_SKILLS = {
    labels: [
      'Gestão de Contratos',
      'Negociação de Preços',
      'Contratação de Serviços',
      'Desenvolv. de Fornecedores',
      'Materiais Indiretos',
      'Redução de Custos',
      'Análise Contratual'
    ],
    data: [98, 95, 95, 92, 90, 90, 88]
  };

  function getPreferredTheme() {
    const saved = localStorage.getItem(THEME_KEY);
    if (saved) return saved;
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }

  function getChartColors() {
    const isDark = html.getAttribute('data-theme') === 'dark';
    return {
      accent: isDark ? '#52b788' : '#2d6a4f',
      accentLight: isDark ? '#74c69d' : '#40916c',
      fill: isDark ? 'rgba(82, 183, 136, 0.35)' : 'rgba(45, 106, 79, 0.35)',
      grid: isDark ? 'rgba(148, 163, 184, 0.25)' : 'rgba(100, 116, 139, 0.2)',
      text: isDark ? '#94a3b8' : '#64748b',
      palette: ['#2d6a4f', '#40916c', '#52b788', '#74c69d', '#1b4332', '#d4a017']
    };
  }

  function setTheme(theme, skipChartUpdate) {
    html.setAttribute('data-theme', theme);
    localStorage.setItem(THEME_KEY, theme);
    if (!skipChartUpdate && Object.keys(charts).length) {
      updateChartsTheme();
    }
  }

  themeToggle.addEventListener('click', () => {
    const current = html.getAttribute('data-theme');
    setTheme(current === 'dark' ? 'light' : 'dark');
  });

  function initRadarChart() {
    const canvas = document.getElementById('skillsRadarChart');
    if (!canvas || typeof Chart === 'undefined') return;

    const colors = getChartColors();
    const ctx = canvas.getContext('2d');

    charts.radar = new Chart(ctx, {
      type: 'radar',
      data: {
        labels: RADAR_SKILLS.labels,
        datasets: [{
          label: 'Nível de Proficiência',
          data: RADAR_SKILLS.data,
          fill: true,
          backgroundColor: colors.fill,
          borderColor: colors.accentLight,
          borderWidth: 3,
          pointBackgroundColor: colors.accentLight,
          pointBorderColor: '#ffffff',
          pointBorderWidth: 2,
          pointRadius: 5,
          pointHoverRadius: 7,
          pointHoverBackgroundColor: '#ffffff',
          pointHoverBorderColor: colors.accentLight
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        animation: {
          duration: 1200,
          easing: 'easeOutQuart'
        },
        elements: {
          line: { borderWidth: 3, tension: 0.1 }
        },
        scales: {
          r: {
            beginAtZero: true,
            min: 0,
            max: 100,
            ticks: {
              display: false,
              stepSize: 20
            },
            grid: {
              color: colors.grid,
              circular: true
            },
            angleLines: {
              color: colors.grid
            },
            pointLabels: {
              color: colors.text,
              font: { family: 'Inter', size: 11, weight: '600' },
              padding: 12
            }
          }
        },
        plugins: {
          legend: { display: false },
          tooltip: {
            backgroundColor: 'rgba(15, 20, 25, 0.9)',
            padding: 12,
            callbacks: {
              label: (ctx) => ` ${ctx.parsed.r}% de proficiência`
            }
          }
        }
      }
    });
  }

  function initDoughnutChart() {
    const canvas = document.getElementById('areaChart');
    if (!canvas || typeof Chart === 'undefined') return;

    const colors = getChartColors();
    const isDark = html.getAttribute('data-theme') === 'dark';

    charts.doughnut = new Chart(canvas.getContext('2d'), {
      type: 'doughnut',
      data: {
        labels: ['Compras', 'Qualidade', 'Administrativo', 'Vendas / Telemarketing'],
        datasets: [{
          data: [58, 30, 9, 3],
          backgroundColor: colors.palette,
          borderColor: isDark ? '#1a2332' : '#ffffff',
          borderWidth: 3,
          hoverOffset: 10
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        cutout: '62%',
        plugins: {
          legend: {
            position: 'bottom',
            labels: {
              color: colors.text,
              font: { family: 'Inter', size: 11 },
              padding: 14,
              boxWidth: 12
            }
          }
        }
      }
    });
  }

  function initTimelineChart() {
    const canvas = document.getElementById('timelineChart');
    if (!canvas || typeof Chart === 'undefined') return;

    const colors = getChartColors();

    charts.timeline = new Chart(canvas.getContext('2d'), {
      type: 'bar',
      data: {
        labels: ['Guaíba', 'Multiação', 'Sabó', 'PRÁTIKKA', 'Metagal', 'Audax', 'IAM'],
        datasets: [{
          label: 'Anos',
          data: [2.1, 0.9, 4.5, 2.2, 10.7, 0.9, 1.2],
          backgroundColor: colors.palette.map((c) => c + 'cc'),
          borderColor: colors.palette,
          borderWidth: 1,
          borderRadius: 8
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          x: {
            grid: { display: false },
            ticks: {
              color: colors.text,
              font: { size: 10 },
              maxRotation: 40,
              minRotation: 20
            }
          },
          y: {
            beginAtZero: true,
            grid: { color: colors.grid },
            ticks: { color: colors.text, font: { size: 10 } }
          }
        },
        plugins: {
          legend: { display: false },
          tooltip: {
            callbacks: {
              label: (ctx) => ` ${ctx.parsed.y} anos`
            }
          }
        }
      }
    });
  }

  function updateChartsTheme() {
    const colors = getChartColors();
    const isDark = html.getAttribute('data-theme') === 'dark';
    const borderColor = isDark ? '#1a2332' : '#ffffff';

    if (charts.radar) {
      const ds = charts.radar.data.datasets[0];
      ds.backgroundColor = colors.fill;
      ds.borderColor = colors.accentLight;
      ds.pointBackgroundColor = colors.accentLight;
      charts.radar.options.scales.r.grid.color = colors.grid;
      charts.radar.options.scales.r.angleLines.color = colors.grid;
      charts.radar.options.scales.r.pointLabels.color = colors.text;
      charts.radar.update();
    }

    if (charts.doughnut) {
      charts.doughnut.data.datasets[0].borderColor = borderColor;
      charts.doughnut.options.plugins.legend.labels.color = colors.text;
      charts.doughnut.update();
    }

    if (charts.timeline) {
      charts.timeline.options.scales.x.ticks.color = colors.text;
      charts.timeline.options.scales.y.ticks.color = colors.text;
      charts.timeline.options.scales.y.grid.color = colors.grid;
      charts.timeline.update();
    }
  }

  function animateSkillBars() {
    const items = document.querySelectorAll('.skill-bar-item');
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const item = entry.target;
          const value = item.getAttribute('data-value');
          const fill = item.querySelector('.skill-bar-fill');
          if (fill) {
            fill.style.width = value + '%';
          }
          item.classList.add('skill-bar-item--visible');
          observer.unobserve(item);
        });
      },
      { threshold: 0.2 }
    );
    items.forEach((item) => observer.observe(item));
  }

  function initCharts() {
    if (typeof Chart === 'undefined') {
      console.warn('Chart.js não carregou. Verifique sua conexão com a internet.');
      return;
    }
    initRadarChart();
    initDoughnutChart();
    initTimelineChart();
  }

  function initFadeIn() {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.08 }
    );

    document
      .querySelectorAll('.timeline-item, .achievement-card, .info-card, .cert-card, .quote-card')
      .forEach((el) => {
        el.classList.add('fade-in');
        observer.observe(el);
      });
  }

  document.querySelectorAll('.sidebar-nav a').forEach((link) => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const target = document.querySelector(link.getAttribute('href'));
      if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });

  function boot() {
    setTheme(getPreferredTheme(), true);
    initCharts();
    animateSkillBars();
    initFadeIn();

    window.addEventListener('resize', () => {
      Object.values(charts).forEach((c) => c.resize());
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
})();
