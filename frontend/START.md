# Frontend quick start

1) Install deps
```
npm install
```

2) Set env
```
cp .env.example .env.local  # then edit values if needed
```

3) Run dev server
```
npm run dev
```

Default URLs
- Vite dev: http://localhost:5173
- API gateway: http://localhost:8085/api (from .env)

Notes
- Restart `npm run dev` after changing env vars.
- Auth0 values come from .env.local (domain/client/audience).
