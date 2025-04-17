// client/src/pages/Profile/ProfileSkeleton.jsx
import React from 'react';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Separator } from '@/components/ui/separator';

const ProfileSkeleton = () => (
  <div className="container max-w-4xl mx-auto py-8 px-4">
    <Card className="w-full shadow-lg overflow-hidden">
      <div className="h-40 bg-gradient-to-r from-gray-200 to-gray-300"></div>
      <div className="px-6 pb-4 pt-4 flex flex-col md:flex-row md:items-end gap-4">
        <Skeleton className="h-24 w-24 rounded-full mt-[-3rem] border-4 border-white" />
        <div className="flex-1">
          <Skeleton className="h-8 w-48 mb-2" />
          <Skeleton className="h-4 w-64 mb-1" />
        </div>
        <Skeleton className="h-10 w-28 mt-2 md:mt-0" />
      </div>
      
      <Separator />
      
      <CardContent className="px-6 py-6">
        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-5">
            <Skeleton className="h-16 w-full" />
            <Skeleton className="h-16 w-full" />
            <Skeleton className="h-16 w-full" />
          </div>
          <div className="space-y-5">
            <Skeleton className="h-16 w-full" />
            <Skeleton className="h-16 w-full" />
            <Skeleton className="h-16 w-full" />
          </div>
        </div>
        <Skeleton className="h-40 w-full mt-8" />
      </CardContent>
      
      <CardFooter className="bg-gray-50 py-4 border-t">
        <Skeleton className="h-4 w-48" />
      </CardFooter>
    </Card>
  </div>
);

export default ProfileSkeleton;