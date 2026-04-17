import { createApp, defineComponent } from 'vue'
import { createPinia } from 'pinia'
import router from './router'
import '@itsiae/siae-design-system/dist/siae-design-system.css'
import * as SiaeDS from '@itsiae/siae-design-system'
import App from './App.vue'

const app = createApp(App)
app.use(createPinia())
app.use(router)
Object.entries(SiaeDS).forEach(([name, component]) => {
  if (name.startsWith('Siae')) app.component(name, component as ReturnType<typeof defineComponent>)
})
app.mount('#app')
