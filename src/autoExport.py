import os

def camel_case(snake_str):
    """Convert snake_case to CamelCase"""
    components = snake_str.split('_')
    return components[0].capitalize() + ''.join(x.capitalize() or '_' for x in components[1:])

def generate_index_and_router(directory,components_directory, views_index_file, components_index_file , router_index_file, store_file,store_file_directory,store_index_file,utils_file_directory,utils_index_file):
    vue_files = [f for f in os.listdir(directory) if f.endswith('.vue')]
    components_files = [f for f in os.listdir(components_directory) if f.endswith('.vue')]
    ts_files = [f for f in os.listdir(store_file_directory) if f.endswith('.ts')]
    utils_files = [f for f in os.listdir(utils_file_directory) if f.endswith('.ts')]
    component_names = []
    component_names2 = []

    with open(views_index_file, 'w') as index_f:
        index_f.write("// Auto-generated file\n")
        for vue_file in vue_files:
            component_name = os.path.splitext(vue_file)[0]
            component_name_camel = camel_case(component_name)
            component_names.append(component_name_camel)
            index_f.write(f"import {component_name_camel} from './{vue_file}';\n")
        
        index_f.write("\nexport {\n")
        for component_name in component_names:
            index_f.write(f"  {component_name},\n")
        index_f.write("};\n")


    with open(components_index_file, 'w') as index_f:
        index_f.write("// Auto-generated file\n")
        for vue_file in components_files:
            component_name = os.path.splitext(vue_file)[0]
            component_name_camel = camel_case(component_name)
            component_names2.append(component_name_camel)
            index_f.write(f"import {component_name_camel} from './{vue_file}';\n")
        
        index_f.write("\nexport {\n")
        for component_name in component_names2:
            index_f.write(f"  {component_name},\n")
        index_f.write("};\n")

    with open(router_index_file, 'w') as router_f:
        router_f.write("import { createRouter, createWebHistory } from 'vue-router'\n")
        router_f.write(f"import {{ {', '.join(component_names)} }} from '@/views/index'\n\n")
        router_f.write("const router = createRouter({\n")
        router_f.write("  history: createWebHistory(import.meta.env.BASE_URL),\n")
        router_f.write("  routes: [\n")
        router_f.write("    {\n")
        router_f.write(f"      path: '/',\n")
        router_f.write(f"      name: '',\n")
        router_f.write(f"      component: {'Homeview'}\n")
        router_f.write("    },\n")
        for component_name in component_names:
            router_f.write("    {\n")
            router_f.write(f"      path: '/{component_name}',\n")
            router_f.write(f"      name: '{component_name}',\n")
            router_f.write(f"      component: {component_name}\n")
            router_f.write("    },\n")
        router_f.write("  ]\n")
        router_f.write("})\n\n")
        router_f.write("export default router\n")
    
    with open(store_file, 'w') as store_f:
        store_f.write("import { ref } from 'vue'\n")
        store_f.write("import { defineStore } from 'pinia'\n\n")
        store_f.write("export const useViewsInfoStore = defineStore('viewsInfo', () => {\n")
        store_f.write("  const PageInfo = ref([\n")
        for i, component_name in enumerate(component_names):
            store_f.write(f"    {{ name: '{component_name}', layer: {i + 1} }},\n")
        store_f.write("  ])\n\n")
        store_f.write("  return { PageInfo }\n")
        store_f.write("})\n")
        
    with open(store_index_file, 'w') as store_f:
        store_f.write("import { createPinia } from 'pinia';\n")
        store_f.write("const store = createPinia();\n")
        store_f.write("export default store;\n\n")

        for ts_file in ts_files:
            module_name = os.path.splitext(ts_file)[0]
            if(module_name != "index"):
                store_f.write(f"export * from './{module_name}';\n")

    with open(utils_index_file, 'w') as store_f:
        for ts_file in utils_files:
            module_name = os.path.splitext(ts_file)[0]
            if(module_name != "index"):
                store_f.write(f"export * from './{module_name}';\n")

if __name__ == "__main__":
    directory = "./views"  # 替换为你的文件夹路径
    components_directory = "./components"  # 替换为你的文件夹路径
    views_index_file = "./views/index.ts"  # 生成的导出文件名
    components_index_file = "./components/index.ts"  # 生成的导出文件名
    router_index_file = "./router/index.ts"  # 生成的路由文件名
    store_file = "./stores/viewsInfo.ts"
    store_file_directory = "./stores"
    store_index_file = "./stores/index.ts"
    utils_file_directory = "./utils"
    utils_index_file = "./utils/index.ts"
    generate_index_and_router(directory,components_directory, views_index_file, components_index_file,router_index_file,store_file,store_file_directory,store_index_file,utils_file_directory,utils_index_file)
    print(f"Generated {views_index_file} ; {components_index_file};{router_index_file}")
