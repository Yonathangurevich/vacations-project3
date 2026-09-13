import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { Layout } from './components/layout-area/layout/layout'
import { Provider } from 'react-redux'
import './index.css'
import { interceptor } from './utils/interceptor'
import { store } from './redux/store'

// Create interceptor: 
interceptor.create();

createRoot(document.getElementById('root')!).render(

    <BrowserRouter>
        <Provider store={store}>
            <Layout />
        </Provider>
    </BrowserRouter>

)
