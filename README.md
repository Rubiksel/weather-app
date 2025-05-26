# 🌤️ Angular Weather App

This is a weather forecast application built with Angular. It allows users to search for weather forecasts by city or geographic coordinates, toggle between metric and imperial units, and choose the number of days for the forecast.

## 🚀 Live Demo

You can view the live version of the app here:  
👉 https://rubiksel.github.io/weather-app/

## 📦 Setup Instructions

### 1. Clone the repository

```bash
git clone https://github.com/your-username/weather-app.git
cd weather-app
```

### 2. Install dependencies

```bash
npm install
```

### 3. Create the environment configuration file

Create a file at:

```
src/environments/environment.ts
```

And add the following:

```ts
export const environment = {
  production: false,
  openWeatherApiKey: "YOUR_API_KEY_HERE",
};
```

> 🔐 **Do not commit your API key to version control.**  
> This file is usually ignored by `.gitignore`.

### 4. Run the app locally

```bash
ng serve
```

Then visit `http://localhost:4200` in your browser.
