// A reactive wrapper around our global configuration (in models/config.ts).
// This wrapper helps keep the model blissfully unaware of vue.js shenanigans

import { Config } from "@/models/config";
import { reactive } from 'vue';

export const config = reactive(Config);

