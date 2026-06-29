import { useQuery } from '@tanstack/react-query';
import { categoriesService } from '@/services/categories.service';

export function useCategories() {
  return useQuery({
    queryKey: ['categories'],
    queryFn: categoriesService.getAll,
    select: (res) => res.data.data,
    staleTime: 5 * 60 * 1000, // categories rarely change
  });
}
