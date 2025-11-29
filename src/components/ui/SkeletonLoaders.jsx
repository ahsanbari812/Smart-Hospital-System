import { Card, CardContent, CardHeader } from './Card';
import Skeleton from './Skeleton';

export const DashboardSkeleton = () => {
    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <Skeleton variant="title" className="w-48" />

            {/* Stats Cards Skeleton */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                {[...Array(4)].map((_, i) => (
                    <Card key={i} className="border-l-4">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <Skeleton className="h-4 w-24" />
                            <Skeleton variant="circle" className="h-8 w-8" />
                        </CardHeader>
                        <CardContent>
                            <Skeleton className="h-8 w-16 mb-2" />
                            <Skeleton className="h-3 w-20" />
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Content Cards Skeleton */}
            <div className="grid gap-6 md:grid-cols-2">
                {[...Array(2)].map((_, i) => (
                    <Card key={i} className="shadow-md">
                        <CardHeader>
                            <Skeleton className="h-6 w-40" />
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {[...Array(3)].map((_, j) => (
                                    <div key={j} className="flex items-center gap-4 rounded-lg border p-4">
                                        <Skeleton variant="circle" className="h-10 w-10" />
                                        <div className="flex-1 space-y-2">
                                            <Skeleton className="h-4 w-32" />
                                            <Skeleton className="h-3 w-48" />
                                        </div>
                                        <Skeleton className="h-6 w-16 rounded-full" />
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
};

export const TableSkeleton = ({ rows = 5, columns = 4 }) => {
    return (
        <div className="space-y-3">
            {/* Header */}
            <div className="flex gap-4 pb-3 border-b">
                {[...Array(columns)].map((_, i) => (
                    <Skeleton key={i} className="h-4 flex-1" />
                ))}
            </div>
            {/* Rows */}
            {[...Array(rows)].map((_, i) => (
                <div key={i} className="flex gap-4 py-3">
                    {[...Array(columns)].map((_, j) => (
                        <Skeleton key={j} className="h-4 flex-1" />
                    ))}
                </div>
            ))}
        </div>
    );
};

export const CardSkeleton = () => {
    return (
        <Card>
            <CardHeader>
                <Skeleton className="h-6 w-40 mb-2" />
                <Skeleton className="h-4 w-64" />
            </CardHeader>
            <CardContent>
                <div className="space-y-3">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-5/6" />
                    <Skeleton className="h-4 w-4/6" />
                </div>
            </CardContent>
        </Card>
    );
};

export default Skeleton;
