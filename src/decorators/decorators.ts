import { createDecorator } from "vue-class-component";

export const Meta = createDecorator((options, key) => {
  if (options.methods) {
    options["metaInfo"] = options.methods[key];
  }
});
