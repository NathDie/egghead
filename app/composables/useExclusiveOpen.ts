export function useExclusiveOpen(group = "exclusive-open") {
    const openId = useState<string | null>(group, () => null);
    const id = useId();

    const isOpen = computed({
        get: () => openId.value === id,
        set: (value: boolean) => {
            if (value) openId.value = id;
            else if (openId.value === id) openId.value = null;
        },
    });

    onBeforeUnmount(() => {
        if (openId.value === id) openId.value = null;
    });

    return isOpen;
}