# Financial Market Anomaly Engine - Grafana Datasource Plugin

A sophisticated Grafana datasource plugin that generates synthetic financial market anomaly signals using advanced mathematical models. This plugin creates realistic time-series data with anomalies, spikes, volatility clusters, and complex patterns for testing, demonstration, and educational purposes.

Created by **Eda Kızılarmut**

## Features

- **6 Unique Anomaly Metrics:**
  - **USI (Unexpected Spike Index):** Measures sudden price movements that deviate from expected patterns
  - **LCL (Liquidity Chaos Level):** Quantifies market liquidity disruptions and order book imbalances
  - **VSS (Volatility Storm Score):** Tracks clustering of high-volatility periods
  - **MPW (Market Panic Wave):** Detects coordinated selling pressure and fear-driven behavior
  - **SPS (Synthetic Price Shock):** Simulates extreme price movements from external shocks
  - **ADF (Algorithmic Distortion Factor):** Identifies anomalies caused by automated trading systems

- **Advanced Mathematical Models:**
  - Gaussian noise for realistic market fluctuations
  - Uniform random noise for evenly distributed patterns
  - Chaotic noise using deterministic chaos theory
  - Volatility clustering (GARCH-like behavior)
  - Periodic components with multiple frequencies
  - Sudden spike generation with configurable frequency

- **Configurable Parameters:**
  - Metric type selection
  - Volatility level control (0-100)
  - Spike frequency adjustment
  - Custom engine seed for reproducibility
  - Noise model selection

## Installation

### Prerequisites

- Node.js >= 18
- npm or yarn
- Docker and Docker Compose (for running Grafana locally)

### Step 1: Clone or Download

```bash
cd grafana-financial-anomaly-datasource
```

### Step 2: Install Dependencies

```bash
npm install
```

### Step 3: Build the Plugin

```bash
npm run build
```

This will compile TypeScript and create the `dist` folder with the production-ready plugin.

## Development

### Running in Development Mode

For active development with hot reload:

```bash
npm run dev
```

This will watch for file changes and automatically rebuild.

### Running Grafana with Docker

Create a `docker-compose.yml` file in your project root:

```yaml
version: '3.8'

services:
  grafana:
    image: grafana/grafana:latest
    ports:
      - "3000:3000"
    environment:
      - GF_DEFAULT_APP_MODE=development
      - GF_PLUGINS_ALLOW_LOADING_UNSIGNED_PLUGINS=eda-fin-anomaly-ds
    volumes:
      - ./dist:/var/lib/grafana/plugins/eda-fin-anomaly-ds
      - grafana-storage:/var/lib/grafana

volumes:
  grafana-storage:
```

Start Grafana:

```bash
docker-compose up -d
```

Access Grafana at `http://localhost:3000` (default credentials: admin/admin)

### Alternative: Manual Plugin Installation

If you have Grafana installed locally, copy the `dist` folder to your Grafana plugins directory:

```bash
# Linux
cp -r dist /var/lib/grafana/plugins/eda-fin-anomaly-ds

# macOS (Homebrew)
cp -r dist /usr/local/var/lib/grafana/plugins/eda-fin-anomaly-ds

# Windows
copy dist "C:\Program Files\GrafanaLabs\grafana\data\plugins\eda-fin-anomaly-ds"
```

Restart Grafana after copying.

## Adding the Datasource

1. Navigate to **Configuration** → **Data Sources** in Grafana
2. Click **Add data source**
3. Search for **"Financial Anomaly Engine"**
4. Click on it to configure

### Configuration Options

- **Engine Seed:** (Optional) Set a specific seed for reproducible results. Leave empty for random generation.
- **Noise Model:** Choose between:
  - **Gaussian:** Normal distribution noise - smooth, bell-curve patterns
  - **Uniform:** Evenly distributed random fluctuations
  - **Chaotic:** Complex patterns from deterministic chaos theory

5. Click **Save & Test** to verify the connection

## Creating Queries

### Query Parameters

When creating a panel, configure the following parameters:

1. **Metric Type:** Select from USI, LCL, VSS, MPW, SPS, or ADF
2. **Volatility Level:** Control intensity (0-100)
   - Low values (0-30): Stable market with small fluctuations
   - Medium values (30-70): Normal market conditions
   - High values (70-100): Extreme volatility with large swings
3. **Spike Frequency:** Number of anomalous spikes (0-50)
   - Determines how many sudden jumps appear in the time range

### Example Queries

#### Query 1: Low Volatility Spike Detection
```
Metric Type: USI (Unexpected Spike Index)
Volatility Level: 25
Spike Frequency: 3
```
**Use Case:** Monitor for rare, unexpected price movements in stable markets

#### Query 2: High Volatility Storm
```
Metric Type: VSS (Volatility Storm Score)
Volatility Level: 85
Spike Frequency: 15
```
**Use Case:** Simulate extreme market stress conditions

#### Query 3: Liquidity Crisis Simulation
```
Metric Type: LCL (Liquidity Chaos Level)
Volatility Level: 60
Spike Frequency: 8
```
**Use Case:** Test dashboards against liquidity disruption scenarios

#### Query 4: Algorithm Impact Analysis
```
Metric Type: ADF (Algorithmic Distortion Factor)
Volatility Level: 40
Spike Frequency: 10
```
**Use Case:** Identify patterns caused by automated trading

## How It Was Built

### Development Process

This plugin was created from scratch as a custom Grafana datasource plugin. Here's the step-by-step process of how it was built:

#### 1. Project Setup

**Technologies Used:**
- **TypeScript** - For type-safe code and better development experience
- **React** - For building the UI components (ConfigEditor and QueryEditor)
- **Webpack** - For bundling the plugin code
- **Grafana SDK** - `@grafana/data`, `@grafana/runtime`, and `@grafana/ui` packages

**Initial Setup:**
```bash
npm init
npm install --save-dev @grafana/data @grafana/runtime @grafana/ui typescript webpack
```

#### 2. Plugin Architecture

The plugin follows Grafana's datasource plugin structure:

**Core Files Created:**
- `src/plugin.json` - Plugin metadata and configuration
- `src/module.ts` - Plugin entry point that registers the datasource
- `src/types.ts` - TypeScript interfaces and enums
- `src/datasource.ts` - Main datasource implementation
- `src/ConfigEditor.tsx` - Data source configuration UI
- `src/QueryEditor.tsx` - Query builder UI

#### 3. Datasource Implementation (`datasource.ts`)

The core logic implements the `DataSourceApi` interface from Grafana:

**Key Methods:**
- `query(request)` - Main method that generates time-series data
- `testDatasource()` - Connection test functionality
- `generateAnomalyData()` - Creates synthetic anomaly signals

**Mathematical Implementation:**
The anomaly generation engine uses several mathematical models:
- Seeded random number generator (LCG - Linear Congruential Generator)
- Gaussian noise using Box-Muller transform
- Uniform random noise
- Chaotic noise using the logistic map
- GARCH-like volatility clustering
- Multi-frequency periodic components
- Controlled spike injection at random intervals

#### 4. UI Components

**ConfigEditor.tsx:**
- Built with Grafana UI components (`InlineField`, `Input`, `Select`, `FieldSet`)
- Allows configuration of engine seed and noise model
- Provides information panel about the plugin
- Includes "Generate Random" button for seed generation

**QueryEditor.tsx:**
- Provides metric type selection dropdown
- Interactive volatility slider (0-100) with numeric input
- Spike frequency control
- Real-time configuration preview

#### 5. Type System

**Defined Types in `types.ts`:**
```typescript
- AnomalyQuery - Query configuration interface
- MetricType - Enum of 6 anomaly metrics (USI, LCL, VSS, MPW, SPS, ADF)
- NoiseModel - Enum for noise types (Gaussian, Uniform, Chaotic)
- METRIC_METADATA - Descriptive metadata for each metric
```

#### 6. Build Configuration

**webpack.config.js:**
- TypeScript compilation with `ts-loader`
- React JSX support
- CSS loading
- Development mode with watch
- Production optimization
- Plugin assets copying

**tsconfig.json:**
- Target: ES2015
- JSX: React
- Strict type checking enabled
- Module resolution: Node

#### 7. Webpack Build Process

The build pipeline:
1. TypeScript compilation to JavaScript
2. React JSX transformation
3. CSS processing
4. Bundle optimization
5. Output to `dist` folder
6. Copy `plugin.json` and assets

#### 8. Development Workflow

**Development Mode:**
```bash
npm run dev
```
Runs webpack in watch mode, automatically rebuilding on file changes.

**Production Build:**
```bash
npm run build
```
Creates optimized bundle for distribution.

#### 9. Integration with Grafana

**Key Integration Points:**
- Implements `DataQueryRequest` handling
- Returns data in DataFrame format
- Supports time range queries
- Provides field metadata (labels, units, types)
- Handles configuration persistence

#### 10. Docker Development Environment

**docker-compose.yml:**
- Uses official Grafana image
- Mounts plugin dist folder as volume
- Configures unsigned plugin loading
- Exposes port 3000 for local access

### Design Decisions

**Why Client-Side Only:**
- No backend required for synthetic data generation
- Simplifies deployment and maintenance
- All logic runs in browser
- No server infrastructure needed

**Why TypeScript:**
- Type safety prevents runtime errors
- Better IDE support with autocomplete
- Easier refactoring
- Self-documenting code

**Why Multiple Noise Models:**
- Demonstrates different mathematical approaches
- Allows users to experiment with various patterns
- Educational value in showing chaos theory
- Provides flexibility for different use cases

**Metric Design Philosophy:**
- Each metric represents a different financial anomaly type
- Base values and trends are metric-specific
- Anomaly scoring is standardized (0-100)
- Labels provide quick visual categorization

### Testing Strategy

**Manual Testing:**
- Visual verification in Grafana dashboards
- Different time ranges (minutes to days)
- Various volatility levels
- Multiple metric types
- Seed reproducibility

**What Was Tested:**
- Data generation correctness
- UI responsiveness
- Configuration persistence
- Time range handling
- Edge cases (zero volatility, max spikes)

## How the Anomaly Engine Works

### Mathematical Foundation

The datasource generates time-series data using a multi-layered approach:

1. **Base Value Component:**
   - Each metric has a characteristic base value (e.g., USI: 100, LCL: 50)
   - Provides the foundation for the signal

2. **Trend Component:**
   - Metric-specific trend functions create directional movement
   - Examples: sinusoidal, exponential decay, linear trends

3. **Periodic Components:**
   - Multiple frequency sine/cosine waves simulate market cycles
   - Creates realistic oscillating patterns

4. **Volatility Clustering:**
   - GARCH-like behavior creates periods of high and low volatility
   - Volatility tends to cluster, mimicking real markets

5. **Noise Generation:**
   - **Gaussian:** `N(0, σ²)` where σ depends on volatility level
   - **Uniform:** `U(-a, a)` for flat distribution
   - **Chaotic:** Logistic map iterations for complex patterns

6. **Spike Injection:**
   - Random positions selected based on spike frequency
   - Magnitude scales with volatility and metric characteristics
   - Both positive and negative spikes possible

7. **Anomaly Scoring:**
   - Calculates deviation from base value
   - Considers spike presence and volatility clustering
   - Returns score from 0-100

### Data Output Format

Each query returns a DataFrame with the following fields:

| Field Name | Type | Description |
|------------|------|-------------|
| `Time` | time | Timestamp for each data point |
| `[Metric Name]` | number | Primary metric value (e.g., "Unexpected Spike Index") |
| `Anomaly Score` | number | Severity score from 0-100 |
| `Label` | string | Classification: NORMAL, LOW, MEDIUM, HIGH, CRITICAL |

### Example DataFrame Output

For a query with time range `last 1 hour` and 500 data points:

```
Time                    | Unexpected Spike Index | Anomaly Score | Label
------------------------|------------------------|---------------|----------
2025-11-26 10:00:00    | 98.3                   | 12.4          | NORMAL
2025-11-26 10:00:07    | 101.7                  | 15.8          | NORMAL
2025-11-26 10:00:14    | 105.2                  | 22.6          | LOW
2025-11-26 10:00:21    | 187.9                  | 87.3          | CRITICAL
2025-11-26 10:00:28    | 97.1                   | 11.2          | NORMAL
...
```

## Visualization Tips

### Recommended Panel Types

1. **Time Series Panel:**
   - Display the main metric and anomaly score
   - Use dual Y-axes for better visualization
   - Add thresholds at anomaly score levels (20, 40, 60, 80)

2. **State Timeline:**
   - Visualize the `Label` field to see anomaly periods
   - Color-code: NORMAL (green), LOW (yellow), MEDIUM (orange), HIGH (red), CRITICAL (dark red)

3. **Stat Panel:**
   - Show current anomaly score
   - Add color thresholds
   - Display max/min/average values

4. **Bar Gauge:**
   - Visualize multiple metrics simultaneously
   - Compare anomaly scores across different metric types

### Example Dashboard Setup

Create a comprehensive monitoring dashboard:

1. **Row 1:** Overview
   - 6 Stat panels showing current value for each metric type

2. **Row 2:** Detailed Analysis
   - Time series panels for selected metrics
   - Overlay anomaly scores

3. **Row 3:** Alert Status
   - State timeline showing label changes over time
   - Table panel with anomaly events

## Testing

Run the test suite:

```bash
npm run test
```

## Building for Production

Create an optimized production build:

```bash
npm run build
```

The compiled plugin will be in the `dist` directory.

### Plugin Signing (Optional)

For public distribution, sign the plugin:

```bash
npm run sign
```

You'll need a Grafana API key for signing.

## Project Structure

```
grafana-financial-anomaly-datasource/
├── src/
│   ├── img/
│   │   └── logo.svg              # Plugin logo
│   ├── ConfigEditor.tsx          # Datasource configuration UI
│   ├── QueryEditor.tsx           # Query builder UI
│   ├── datasource.ts             # Main datasource logic
│   ├── module.ts                 # Plugin registration
│   ├── plugin.json               # Plugin metadata
│   └── types.ts                  # TypeScript interfaces
├── dist/                         # Compiled output (generated)
├── .eslintrc                     # ESLint configuration
├── .gitignore                    # Git ignore rules
├── .prettierrc.js                # Prettier configuration
├── docker-compose.yml            # Docker setup for development
├── package.json                  # Dependencies and scripts
├── tsconfig.json                 # TypeScript configuration
└── README.md                     # This file
```

## Troubleshooting

### Plugin Not Appearing

- Ensure `GF_PLUGINS_ALLOW_LOADING_UNSIGNED_PLUGINS=eda-fin-anomaly-ds` is set
- Check that `dist` folder is properly mounted/copied
- Restart Grafana completely
- Check Grafana logs: `docker-compose logs -f grafana`

### TypeScript Errors

- Run `npm install` to ensure all dependencies are installed
- Delete `node_modules` and `dist`, then reinstall:
  ```bash
  rm -rf node_modules dist
  npm install
  npm run build
  ```

### No Data Returned

- Verify time range is selected in the panel
- Check browser console for JavaScript errors
- Test the datasource connection in settings

## Contributing

Contributions are welcome! Areas for enhancement:

- Additional anomaly detection algorithms
- More noise models (Levy distributions, fractional Brownian motion)
- Real-time anomaly severity adjustment
- Export functionality for generated datasets
- Custom metric builder

## License

MIT License - See LICENSE file for details

## Author

Eda Kizilarmut

## Acknowledgments

Built with:
- Grafana Plugin SDK
- TypeScript
- React
- Mathematical models inspired by financial econometrics research

---

**Note:** This plugin generates **synthetic data only**. It does not connect to real financial markets or APIs. All data is mathematically generated for demonstration, testing, and educational purposes.
