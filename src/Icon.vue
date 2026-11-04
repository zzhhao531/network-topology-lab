<script setup>
defineProps({name:String,size:{type:Number,default:18}});
const paths={play:'m8 5 11 7-11 7V5Z',pause:'M8 5v14M16 5v14',left:'m14 6-6 6 6 6',right:'m10 6 6 6-6 6',reset:'M4 10a8 8 0 1 1 1 8M4 4v6h6',search:'m16 16 5 5M18 10a8 8 0 1 1-16 0 8 8 0 0 1 16 0',external:'M14 3h7v7M21 3 10 14M10 3H4v17h16v-6',network:'M5 6h14M5 6l7 13L19 6M3 4h4v4H3ZM17 4h4v4h-4ZM10 17h4v4h-4Z',check:'m5 12 4 4L19 6'};
</script>
<template><svg :width="size" :height="size" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path :d="paths[name]||paths.right"/></svg></template>
