<script lang="ts">
    import SortIcon from '$lib/assets/sort.svg';
    import FilterIcon from '$lib/assets/filter.svg';
    import DownButton from '$lib/assets/down-button.svg';
    import RightButton from '$lib/assets/right-button.svg';
    import type { Category } from '$lib/types';
    
    let { 
        categoryFilter, 
        selectedFilters = $bindable(), 
        selectedPriceSort = $bindable(), 
        selectedNameSort = $bindable() 
    }: { 
        categoryFilter: Category[], 
        selectedFilters: string[], 
        selectedPriceSort: string, 
        selectedNameSort: string 
    } = $props();

    let showSortOptions = $state<boolean>(false);
    let showNameOptions = $state<boolean>(false);
    let showPriceOptions = $state<boolean>(false);

    const sortMenuItems = [
        {
            label: 'Name',
            isOpen: () => showNameOptions,
            toggle: () => {
                showNameOptions = !showNameOptions;
                showPriceOptions = false;
            },
            options: [
                { value: 'name-asc', label: 'A - Z' },
                { value: 'name-desc', label: 'Z - A' }
            ],
            selectedValue: () => selectedNameSort,
            onSelect: (value: string) => selectedNameSort = value
        },
        {
            label: 'Price',
            isOpen: () => showPriceOptions,
            toggle: () => {
                showPriceOptions = !showPriceOptions;
                showNameOptions = false;
            },
            options: [
                { value: 'price-asc', label: 'Low - High' },
                { value: 'price-desc', label: 'High - Low' }
            ],
            selectedValue: () => selectedPriceSort,
            onSelect: (value: string) => selectedPriceSort = value
        }
    ];

    function handleClickOutside(event: MouseEvent) {
        const sidebar = document.querySelector('.sort-by-container');
        if (sidebar && !sidebar.contains(event.target as Node)) {
            showSortOptions = false;
            showNameOptions = false;
            showPriceOptions = false;
        }
    }

    $effect(() => {
        document.addEventListener('click', handleClickOutside);
        return () => document.removeEventListener('click', handleClickOutside);
    });
</script>

<div class="fixed mt-10 ml-15">
    <!-- Sort By -->
    <div class="mb-3 flex items-center gap-x-2 relative sort-by-container">
        <img src={SortIcon} class="w-[24px] h-[24px] align-middle" alt="Sort Icon" />
        <h3 class="section-title">Sort By</h3>

        <div class="relative">
            <button onclick={() => showSortOptions = !showSortOptions}>
                <img src={DownButton} class="w-[24px] h-[36px] align-middle" alt="Toggle sort options" />
            </button>

            {#if showSortOptions}
                <div class="dropdown-menu">
                    {#each sortMenuItems as item}
                        <div class="flex items-center gap-x-2 relative">
                            <!-- Menu  -->
                            <div class="menu-item">
                                <span class="menu-label">{item.label}</span>
                                <button class="ml-auto pr-2" onclick={item.toggle}>
                                    <img src={RightButton} class="w-[12px] h-[24px] align-middle" alt="Toggle {item.label} options" />
                                </button>
                            </div>
                            
                            <!-- Submenu -->
                            {#if item.isOpen()}
                                <div class="submenu">
                                    {#each item.options as option}
                                        <div class="submenu-item {item.selectedValue() === option.value ? 'selected' : ''}">
                                            <button 
                                                class="submenu-button"
                                                onclick={() => item.onSelect(option.value)}
                                            >
                                                {option.label}
                                            </button>
                                        </div>
                                    {/each}
                                </div>
                            {/if}
                        </div>
                    {/each}
                </div>
            {/if}
        </div>
    </div>

    <hr class="divider" />
    
    <!-- Filter  -->
    <div class="mt-3 mb-6 flex items-center gap-x-2">
        <img src={FilterIcon} class="w-[24px] h-[24px] align-middle" alt="Filter Icon" />
        <h3 class="section-title">Filter</h3>
    </div>

    <!-- Filter Categories -->
    <div class="mb-6">
        <h3 class="filter-subtitle">Categories</h3>
        {#each categoryFilter as item (item.id)}
            <label class="filter-checkbox-label">
                <input 
                    type="checkbox" 
                    bind:group={selectedFilters} 
                    value={item.category} 
                    class="ml-5 mr-2" 
                />
                {item.category}
            </label>
        {/each}
    </div>
</div>

<style>
    .section-title {
        font-family: 'Inter', sans-serif;
        font-weight: 400;
        color: #707070;
        font-size: 18px;
    }

    .filter-subtitle {
        font-family: 'Inter', sans-serif;
        font-weight: 400;
        color: #707070;
        font-size: 16px;
        margin-bottom: 0.5rem;
    }

    .dropdown-menu {
        position: absolute;
        top: 28px;
        left: -15px;
        z-index: 50;
        background-color: white;
        box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
        padding: 0.5rem;
        width: 180px;
        border-radius: 0.375rem;
        display: flex;
        flex-direction: column;
        margin-left: 1rem;
        margin-bottom: 0.5rem;
    }

    .menu-item {
        display: flex;
        align-items: center;
        width: 180px;
        height: 30px;
    }

    .menu-item:hover {
        background-color: #D9D9D9;
    }

    .menu-label {
        padding-left: 0.5rem;
        font-family: 'Inter', sans-serif;
        font-weight: 400;
        color: #707070;
        font-size: 14px;
    }

    .submenu {
        position: absolute;
        top: 5px;
        left: 98%;
        z-index: 50;
        display: flex;
        flex-direction: column;
        background-color: white;
        box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
        width: 100px;
        height: 70px;
        padding-top: 0.375rem;
        border-radius: 0.375rem;
        white-space: nowrap;
    }

    .submenu-item {
        width: 100%;
        height: 30px;
    }

    .submenu-item:hover,

    .submenu-item.selected {
        background-color: #D9D9D9;
    }

    .submenu-button {
        padding-left: 0.75rem;
        width: 100%;
        text-align: left;
        font-family: 'Inter', sans-serif;
        font-weight: 400;
        color: #707070;
        font-size: 14px;
    }

    .filter-checkbox-label {
        display: block;
        margin-bottom: 0.25rem;
        font-family: 'Inter', sans-serif;
        font-weight: 400;
        color: #707070;
        font-size: 14px;
    }

    .divider {
        border-top: 1px solid #D9D9D9;
        width: 220px;
    }
</style>