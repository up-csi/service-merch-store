<script lang="ts">
    import placeholder from "../../../../static/placeholder.svg";

    let { image, price, name } = $props<{
        image: string | null; // path to image in Supabase
        price: number;
        name: string;
    }>();

    let imageUrl = $derived(image ?? placeholder);
</script>

<div class="overflow-hidden rounded-lg bg-white items-center">
    <img 
        src={imageUrl} 
        onerror={() => {imageUrl = placeholder}}
        alt={name} 
        class="w-full h-48 object-cover aspect-square shadow-sm"
        loading="lazy"
    />
    <div class="p-4">
        <h3 class="text-lg">{name}</h3>
        <p class="text-gray-700">₱{price.toLocaleString()}</p>
    </div>
</div>