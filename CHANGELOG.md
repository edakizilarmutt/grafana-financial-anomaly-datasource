# Changelog

All notable changes to the Financial Market Anomaly Engine datasource will be documented in this file.

## [1.0.0] - 2025-11-26

### Added
- Initial release of Financial Market Anomaly Engine datasource
- 6 unique anomaly metrics (USI, LCL, VSS, MPW, SPS, ADF)
- Three noise models (Gaussian, Uniform, Chaotic)
- Configurable volatility levels (0-100)
- Adjustable spike frequency
- Seeded random number generation for reproducibility
- Volatility clustering algorithm
- Periodic components with multiple frequencies
- Anomaly scoring system (0-100)
- Label classification (NORMAL, LOW, MEDIUM, HIGH, CRITICAL)
- Query Editor with intuitive controls
- Config Editor with engine seed and noise model selection
- Comprehensive README with examples
- Docker Compose setup for easy development
- TypeScript type safety throughout

### Features
- Generates 200-1000 data points per query based on time range
- Multiple mathematical patterns:
  - Gaussian noise for realistic fluctuations
  - Sudden spikes with configurable frequency
  - Volatility clustering (GARCH-like)
  - Periodic oscillations
  - Metric-specific trend components
- Real-time data generation
- No external dependencies or APIs required
- Fully client-side operation

### Technical Details
- Built with Grafana Plugin SDK
- TypeScript 5.0+
- React components for UI
- Seeded RNG for reproducible results
- Box-Muller transform for Gaussian distribution
- Logistic map for chaotic behavior
